
import { formatElapsedTime, formatHoursMinutes, setTimeOfDay } from '../../../../utils/time';
import { useTrackingDisplay } from '../../../../hooks/useTrackingDisplay';
import { useTodayRecords } from '../../../../hooks/useTodayRecords';
import { useProjectContext } from '../../../../contexts/ProjectContext';
import { useClientBreakdown } from '../../../../hooks/useClientBreakdown';
import { updateSegment, type Segment, type SegmentError } from '../../../../utils/storage';
import { useEffect, useState } from 'react';
import { TimeDropdown } from './TimeDropdown';

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = Array.from({ length: 60}, (_, i) => i)

type TimeField = 'startTime' | 'endTime'
type TimeUnit = 'hours' | 'minutes'

export function TodayTab(){
    const { statusLabel, statusClass, buttonLabel, buttonIcon, buttonAction, showWarning, elapsedSeconds } = useTrackingDisplay()
    const { todayStartMs, todaySegments, formattedDate} = useTodayRecords()
    const { projects } = useProjectContext()
    const { clientBreakdown } = useClientBreakdown(todaySegments)
    const [ warning, setWarning ] = useState<SegmentError | null>(null)

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
    useEffect(() => {
        console.log(warning)
    },[warning])

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
                            <li className="reproduction">複製</li>
                            <li className="delete">削除</li>
                        </ul>
                        <ul className="p-today__details-data">

                            {todaySegments.map(segment => {
                                const project = projects.find(project => project.id === segment.projectId)
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
                                        <div className="client">
                                            <button className="c-select__trigger">
                                                <span className="c-select__text">キンコーズ</span>
                                                <span className="c-select__arrow-icon">▾</span>
                                            </button>
                                            <ul className="c-select__options">
                                                <li className="c-select__option-item">クライアントB</li>
                                                <li className="c-select__option-item">クライアントC</li>
                                                <li className="c-select__option-item">クライアントD</li>
                                            </ul>
                                        </div>
                                        <div className="project">
                                            <button className="c-select__trigger">
                                                <span className="c-select__text">マルヤ</span>
                                                <span className="c-select__arrow-icon">▾</span>
                                            </button>
                                            <ul className="c-select__options">
                                                <li className="c-select__option-item">案件B</li>
                                                <li className="c-select__option-item">案件C</li>
                                                <li className="c-select__option-item">案件D</li>
                                            </ul>
                                        </div>
                                        <button className="reproduction"><img src="./images/icon_reproduction.svg" alt="" /></button>
                                        <button className="delete"><img src="./images/icon_delete.svg" alt="" /></button>
                                    </li>
                                )
                            })}
                            
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
        </div>
    )
}