
import { formatElapsedTime, formatHoursMinutes, setTimeOfDay } from '../../../../utils/time';
import { useTrackingDisplay } from '../../../../hooks/useTrackingDisplay';
import { useTodayRecords } from '../../../../hooks/useTodayRecords';
import { useProjectContext } from '../../../../contexts/ProjectContext';
import { useClientBreakdown } from '../../../../hooks/useClientBreakdown';
import { updateSegment, deleteSegment, type Segment, type SegmentError } from '../../../../utils/storage';
import { useState } from 'react';
import { TimeDropdown } from './TimeDropdown';
import { SegmentDeleteModal } from './SegmentDeleteModal/SegmentDeleteModal';
import { useClientContext } from '../../../../contexts/ClientContext';
import { SelectDropdown } from './SelectDropdown';
import { useTrackingContext } from '../../../../contexts/TrackingContext';

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = Array.from({ length: 60}, (_, i) => i)
const WARNING_MESSAGES: Record<SegmentError, string> = {
    START_AFTER_END: '※開始時刻は終了時刻より前に設定してください。',
    FUTURE: '※現在より後の時刻には設定できません。',
    OVERLAP: '※他の記録の時間帯と重なるため、設定できません。',
    OVERLAP_CURRENT: '※計測中の時間帯と重なるため、設定できません。',
    NOT_FOUND: '※記録が見つかりませんでした。\n画面を開き直してください。',
}

type TimeField = 'startTime' | 'endTime'
type TimeUnit = 'hours' | 'minutes'

export function TodayTab(){
    const { statusLabel, statusClass, buttonLabel, buttonIcon, buttonAction, showWarning, elapsedSeconds } = useTrackingDisplay()
    const { todayStartMs, todaySegments, formattedDate} = useTodayRecords()
    const { projects } = useProjectContext()
    const { clients } = useClientContext()
    const { clientBreakdown } = useClientBreakdown(todaySegments)
    const { currentSegment } = useTrackingContext()

    const [ warning, setWarning ] = useState<SegmentError | null>(null)
    const [ deleteTargetId, setDeleteTargetId ] = useState<number | null>(null)

    const handleTimeChange = async (segment:Segment,field:TimeField,unit:TimeUnit,value:number) => {
        const base = segment[field]
        if(base === null) return

        const currentHours = new Date(base).getHours()
        const currentMinutes = new Date(base).getMinutes()

        const newHours = unit === 'hours' ? value : currentHours
        const newMinutes = unit === 'minutes' ? value : currentMinutes

        const error = await updateSegment(segment.id,{ [field] :setTimeOfDay(base,newHours,newMinutes)})
        if(error !== null) setWarning(error)
    }

    const handleClientChange = (segmentId:number, clientId:number, currentClientId:number | undefined) => {
        if(clientId === currentClientId) return
        const clientProjects = projects.filter(p => p.clientId === clientId)
        const first = clientProjects[0]
        if(!first) return
        handleProjectChange(segmentId,first.id)
    }

    const handleProjectChange = async (segmentId:number,projectId:number) =>{
        const error = await updateSegment(segmentId, { projectId : projectId })
        if(error !== null) return setWarning(error)
    }

    //案件が最低1つはあるクライアントの配列
    const clientsWithProjects = clients.filter(c => projects.some(p => p.clientId === c.id))

    const newHours = currentSegment === null ? '' : String(new Date(currentSegment.startTime).getHours()).padStart(2, '0')
    const newMinutes = currentSegment === null ? '' : String(new Date(currentSegment.startTime).getMinutes()).padStart(2, '0')
    const currentSegmentProject = projects.find(p => p.id === currentSegment?.projectId)
    const currentSegmentClient = clients.find(c => c.id === currentSegmentProject?.clientId)


    return (
        <div className="c-content-outer">
            <div className="c-content__head">
                <div className="c-content__head-date">
                    <p className="today">Today</p>
                    <p className="date">{formattedDate}</p>
                </div>
                <div className="p-today__record">
                    <div className="p-today__times">
                        <p className={`status ${statusClass}`}>{statusLabel}</p>
                        <p className="time">{formatElapsedTime(elapsedSeconds)}</p>
                    </div>
                    <button 
                        className={`p-today__button ${statusClass}`} 
                        onClick={buttonAction}
                    >
                        <img src={buttonIcon} alt="" />{buttonLabel}
                    </button>
                </div>
            </div>

            <div className="c-content">
                <div className="c-content-inner">
                    <div className="p-today__map">
                        {todaySegments.map(segment => {
                            if(segment.endTime === null) return null
                            const startPercent = ((segment.startTime - todayStartMs) / (24 * 60 * 60 *1000)) * 100
                            const endPercent = ((segment.endTime - todayStartMs) / (24 * 60 * 60 *1000)) * 100
                            const width = endPercent - startPercent
                            const project = projects.find(project => project.id === segment.projectId)
                            return(
                                <div
                                    className='p-today__map-area'
                                    key={segment.id}
                                    style={{
                                        width : `${width}%`,
                                        left : `${startPercent}%`,
                                        backgroundColor : `${project?.color}`
                                    }}
                                />
                            )
                        })}
                    </div>
                    <ul className="p-today__bd">
                        {clientBreakdown.map((cb) => (
                            <li key={cb.clientId} className="p-today__bd-item">
                                <span style={{background:`${cb.clientColor}`}} className="client-color" />
                                {formatHoursMinutes(cb.totalSeconds)}
                                <span className="brackets">（</span>
                                <ul className="p-today__bd-projects">
                                    {cb.projects.map(project => (
                                    <li key={project.projectId} className="project">
                                        <span style={{ background : `${project.projectColor}`}} className="project-color" />
                                        {formatHoursMinutes(project.totalSeconds)}
                                    </li>
                                    ))}
                                </ul>
                                <span>）</span>
                            </li>
                        ))}
                    </ul>

                    <div className="p-today__details">
                        <ul className="p-today__details-title">
                            <li className="color"></li>
                            <li className="start">開始</li>
                            <li className="separate"></li>
                            <li className="finish">終了</li>
                            <li className="client">クライアント</li>
                            <li className="project">案件</li>
                            <li className="delete">削除</li>
                        </ul>
                        <ul className="p-today__details-data">

                            {todaySegments.map(segment => {
                                const project = projects.find(project => project.id === segment.projectId)
                                const client = clients.find(client => project?.clientId === client.id)
                                const currentProjects = projects.filter(project => project.clientId === client?.id)
                                return (
                                    <li key={segment.id} className="item">
                                        <span style={{background : `${project?.color}`}} className="color" />
                                        <div className="start">
                                            <TimeDropdown
                                                value={new Date(segment.startTime).getHours()}
                                                options={HOURS}
                                                onSelect={(n) => handleTimeChange(segment, 'startTime', 'hours', n)}
                                            />
                                            <span className="colon">:</span>
                                            <TimeDropdown
                                                value={new Date(segment.startTime).getMinutes()}
                                                options={MINUTES}
                                                onSelect={(n) => handleTimeChange(segment, 'startTime', 'minutes', n)}
                                            />
                                        </div>
                                        <span className="separate">〜</span>
                                        <div className="finish">
                                            <TimeDropdown
                                                value={segment.endTime === null ? null : new Date(segment.endTime).getHours()}
                                                options={HOURS}
                                                onSelect={(n) => handleTimeChange(segment, 'endTime', 'hours', n)}
                                            />
                                            <span className="colon">:</span>
                                            <TimeDropdown
                                                value={segment.endTime === null ? null : new Date(segment.endTime).getMinutes()}
                                                options={MINUTES}
                                                onSelect={(n) => handleTimeChange(segment, 'endTime', 'minutes', n)}
                                            />
                                        </div>
                                        <div className="client c-select__outer">
                                            <SelectDropdown 
                                                value={client?.name} 
                                                options={clientsWithProjects}
                                                onSelect={(clientId) => handleClientChange(segment.id, clientId,client?.id)}
                                             />
                                        </div>
                                        <div className="project c-select__outer">
                                            <SelectDropdown 
                                                value={project?.name} 
                                                options={currentProjects} 
                                                onSelect={(projectId) => handleProjectChange(segment.id,projectId)}
                                            />
                                        </div>
                                        <button className="delete" onClick={() => setDeleteTargetId(segment.id)}><img src="./images/icon_delete.svg" alt="" /></button>
                                    </li>
                                )
                            })}

                            { currentSegment !== null && currentSegment.status === 'working' && (
                                <li className="item">
                                    <span style={{background : `${currentSegmentProject?.color}`}} className="color" />
                                    <div className="start">
                                        <p className='cs-time'>{newHours}</p>
                                        <span className="colon">:</span>
                                        <p className='cs-time'>{newMinutes}</p>
                                    </div>
                                    <span className="separate">〜</span>
                                    <div className='tracking'>
                                        <p>tracking</p>
                                    </div>
                                    <div className="client">
                                        <p className='cs-name'>{currentSegmentClient?.name}</p>
                                    </div>
                                    <div className="project">
                                        <p className='cs-name'>{currentSegmentProject?.name}</p>
                                    </div>
                                    <div className='delete empty'></div>
                                </li>
                            )}
                            
                        </ul>
                        <button className="p-today__details-add"><img src="./images/icon_plus.svg" alt="" />記録を追加</button>
                    </div>
                </div>
            </div>
        { showWarning && (
            <div className="p-today__caution">
                <div className="p-today__caution-inner">
                    <button><img src="./images/icon_close.svg" alt="" /></button>
                    <p>サイドバーから案件を追加してください</p>
                </div>
            </div>
        )}
        {warning !== null && (
            <div className="p-today__caution">
                <div className="p-today__caution-inner">
                    <button onClick={() => setWarning(null)}>
                        <img src="./images/icon_close.svg" alt="閉じる" />
                    </button>
                    <p className='message'>{WARNING_MESSAGES[warning]}</p>
                </div>
            </div>
        )}
        {deleteTargetId !== null && (
            <SegmentDeleteModal 
                onConfirm={async () => {
                    await deleteSegment(deleteTargetId)
                    setDeleteTargetId(null)
                }}
                onCancel={() => setDeleteTargetId(null)}
            />
        )}
        </div>
    )
}