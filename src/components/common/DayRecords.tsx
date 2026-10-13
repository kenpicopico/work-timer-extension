import { useState } from "react"
import { useDayRecords } from "../../hooks/useDayRecords"
import { useProjectContext } from "../../contexts/ProjectContext"
import { useClientBreakdown } from "../../hooks/useClientBreakdown"
import { useTrackingContext } from "../../contexts/TrackingContext"
import { useSelectionContext } from "../../contexts/SelectionContext"
import { formatHoursMinutes, setTimeOfDay } from "../../utils/time"
import { useClientContext } from "../../contexts/ClientContext"
import { TimeDropdown } from "../LargeWindow/ContentArea/tabs/TimeDropdown"
import { SelectDropdown } from "../LargeWindow/ContentArea/tabs/SelectDropdown"
import { WarningPopup } from "./WarningPopup"
import { SegmentDeleteModal } from "../LargeWindow/ContentArea/tabs/SegmentDeleteModal/SegmentDeleteModal"
import { updateSegment, deleteSegment, findFreeSlot, addNewSegment, type FinishedSegment, type SegmentError } from "../../utils/storage"

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = Array.from({ length: 60}, (_, i) => i)
type TimeField = 'startTime' | 'endTime'
type TimeUnit = 'hours' | 'minutes'
const WARNING_MESSAGES: Record<SegmentError, string> = {
    START_AFTER_END: '※開始時刻は終了時刻より前に設定してください。',
    FUTURE: '※現在より後の時刻には設定できません。',
    OVERLAP: '※他の記録の時間帯と重なるため、設定できません。',
    OVERLAP_CURRENT: '※計測中の時間帯と重なるため、設定できません。',
    NOT_FOUND: '※記録が見つかりませんでした。\n画面を開き直してください。',
    NO_FREE_SLOT: '※空き時間がないため、記録を追加できません。',
    NO_PROJECT: '※記録を追加するには案件が必要です。\nサイドバーから案件を追加してください。'
}

export type DayRecordsProps = {
    date : Date
}

export const DayRecords = ({date}:DayRecordsProps) => {
    const { dayStartMs, daySegments} = useDayRecords(date)
    const { projects } = useProjectContext()
    const { clients } = useClientContext()
    const { clientBreakdown } = useClientBreakdown(daySegments)
    const { currentSegment } = useTrackingContext()
    const { projectId } = useSelectionContext()

    const [ warning, setWarning ] = useState<SegmentError | null>(null)
    const [ deleteTargetId, setDeleteTargetId ] = useState<number | null>(null)

    const handleTimeChange = async (segment:FinishedSegment,field:TimeField,unit:TimeUnit,value:number) => {
        const base = segment[field]

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

    const handleAddSegment = async () => {
        if(projectId === null){
            setWarning('NO_PROJECT')
            return
        }
        const startTime = findFreeSlot(dayStartMs, daySegments, currentSegment)
        if(startTime === null) {
            setWarning('NO_FREE_SLOT')
            return 
        }
        await addNewSegment(startTime, projectId)
    }


    return (
        <div className="c-content-inner">
            <div className="p-today__map">
                {daySegments.map(segment => {
                    const startPercent = ((segment.startTime - dayStartMs) / (24 * 60 * 60 *1000)) * 100
                    const endPercent = ((segment.endTime - dayStartMs) / (24 * 60 * 60 *1000)) * 100
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
                <p className='am0'>0:00</p>
                <p className='am4'>4:00</p>
                <p className='am8'>8:00</p>
                <p className='am12'>12:00</p>
                <p className='pm4'>16:00</p>
                <p className='pm8'>20:00</p>
                <p className='pm12'>24:00</p>
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

                    {daySegments.map(segment => {
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
                                        value={new Date(segment.endTime).getHours()}
                                        options={HOURS}
                                        onSelect={(n) => handleTimeChange(segment, 'endTime', 'hours', n)}
                                    />
                                    <span className="colon">:</span>
                                    <TimeDropdown
                                        value={new Date(segment.endTime).getMinutes()}
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
                <button className="p-today__details-add" onClick={handleAddSegment}><img src="./images/icon_plus.svg" alt="" />記録を追加</button>
            </div>
            {warning !== null && (
                <WarningPopup message={WARNING_MESSAGES[warning]} onClose={() => setWarning(null)} />
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