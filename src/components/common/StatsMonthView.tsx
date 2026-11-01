import { useState } from "react"
import { useClientBreakdown } from "../../hooks/useClientBreakdown"
import { getMonthDates, getMonthPeriod, summarizeSegments } from "../../utils/date"
import { useSegments } from "../../hooks/useSegments"
import { useClientContext } from "../../contexts/ClientContext"
import { formatHoursMinutes, formatDateWithDay } from "../../utils/time"
import { useProjectContext } from "../../contexts/ProjectContext"
import { DayRecords } from "./DayRecords"

export type StatsMonthViewProps = {
    year : number
    month : number
}

export function StatsMonthView({year,month} : StatsMonthViewProps){
    const { clients } = useClientContext()
    const { projects } = useProjectContext()
    const segments = useSegments()
    const period = getMonthPeriod(year,month)
    const periodSegments = segments.filter(s => s.startTime >= period.start && s.startTime < period.end)
    const { clientBreakdown } = useClientBreakdown(periodSegments)
    const [ pickupDate, setPickupDate ] = useState<Date | null>(null)
    const dailyDatas = getMonthDates(periodSegments,year,month)
    const now = new Date()
    const today = now.setHours(0,0,0,0)

    //カレンダー
    const firstDay = new Date(year, month - 1, 1)
    const startEmptyDays = firstDay.getDay()
    const startEmptyArray = Array(startEmptyDays).fill(null)
    const totalLength = dailyDatas.length + startEmptyDays
    const endEmptyDays = (7 - (totalLength % 7)) % 7
    const endEmptyArray = Array(endEmptyDays).fill(null)

    //日毎のモーダル内作業時間表示
    const pickupData = pickupDate === null ? undefined : dailyDatas.find(d => d.date === pickupDate.getDate())
    const dayTotalSeconds = pickupData?.totalSeconds ?? 0


    return (
        <div className="c-content">
            {clientBreakdown.length === 0 && (
                <div className="p-stats__inner nodata">
                    <p className="p-stats__nodata">記録がありません。</p>
                </div>
            )}
            {clientBreakdown.map(cb => {
                const clientName = clients.find(c => c.id === cb.clientId)?.name
                const projectIds = projects.filter(p => p.clientId === cb.clientId).map(p => p.id)
                const projectSegments = periodSegments.filter(s => projectIds.includes(s.projectId))
                const { workDays } = summarizeSegments(projectSegments)
                const clientAverage = formatHoursMinutes(cb.totalSeconds / workDays)
                return (
                    <div key={cb.clientId} className="p-stats__inner">
                        <div className="p-stats__client">
                            <ul className="p-stats__client-head">
                                <li className="name"></li>
                                <li className="total">合計時間</li>
                                <li className="days">稼働日数</li>
                                <li className="average">1日平均</li>
                            </ul>
                            <ul className="p-stats__client-data">
                                <li className="p-stats__client-item client-data">
                                    <div className="name">
                                        <span className="color" style={{background : `${cb.clientColor}`}}></span>
                                        <span className="title">{clientName}</span>
                                    </div>
                                    <div className="total">{formatHoursMinutes(cb.totalSeconds)}</div>
                                    <div className="days">{workDays}</div>
                                    <div className="average">{clientAverage}</div>
                                </li>
                                {cb.projects.map(p => {
                                    const projectName = projects.find(project => project.id ===p.projectId )?.name
                                    const projectSegments = periodSegments.filter(s => s.projectId === p.projectId)
                                    const { workDays } = summarizeSegments(projectSegments)
                                    const projectAverage = formatHoursMinutes(p.totalSeconds / workDays)
                                    return (
                                        <li key={p.projectId} className="p-stats__client-item project-data">
                                            <div className="name">
                                                <span className="color" style={{background : `${p.projectColor}`}}></span>
                                                <span className="title">{projectName}</span>
                                            </div>
                                            <div className="total">{formatHoursMinutes(p.totalSeconds)}</div>
                                            <div className="days">{workDays}</div>
                                            <div className="average">{projectAverage}</div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                )
            })}
            <div className="p-stats__inner">
                <div className="p-project__calendar">
                    <div className="p-project__calendar-head">
                        <p>Sun</p>
                        <p>Mon</p>
                        <p>Tue</p>
                        <p>Wed</p>
                        <p>Thu</p>
                        <p>Fri</p>
                        <p>Sat</p>
                    </div>
                    <div className="p-project__calendar-main">
                        {startEmptyArray.map((_,index) => (
                            <div key={index} className="box" />
                        ))}
                        {dailyDatas.map(d => {
                            const time = formatHoursMinutes(d.totalSeconds)
                            const cellDate = new Date(year,month - 1,d.date)
                            const dayStart = new Date(year, month - 1, d.date).getTime()
                            const dayEnd = new Date(year, month - 1, d.date + 1).getTime()
                            const daySegments = periodSegments.filter(s => s.startTime >= dayStart && s.startTime < dayEnd)
                            const dayProjectIds = [...new Set(daySegments.map(s => s.projectId))]
                            const dayClientIds = projects.filter(p => dayProjectIds.includes(p.id)).map(p => p.clientId)
                            const dayClients = clients.filter(c => dayClientIds.includes(c.id) )
                            return (
                                <div key={d.date} className="box">
                                    <button className="btn stats-btn" type="button" onClick={() => setPickupDate(cellDate)} disabled={ new Date(year,month -1,d.date).getTime() > today}>
                                        <span className="date">{d.date}</span>
                                        {d.totalSeconds > 0 && (
                                            <div className="project-colors">
                                                <div className="project-colors__inner">
                                                    {dayClients.map(dp => (
                                                        <span key={dp.id} style={{background: `${dp.color}`}}></span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <p className="working-time">{d.totalSeconds > 0 && time}</p>
                                    </button>
                                </div>
                            )
                        })}
                        {endEmptyArray.map((_,index) => (
                            <div key={index} className="box" />
                        ))}
                    </div>
                </div>
            </div>
            { pickupDate !== null && (
                <div className="p-project__modal">
                    <div className="p-project__modal-inner">
                        <div className="c-content__head">
                            <div className="c-content__head-date">
                                <p className="date">{formatDateWithDay(pickupDate)}</p>
                            </div>
                            <div className="p-project__times">
                                <div className="box">
                                    <p className="name">合計<br />時間</p>
                                    <p className="number">{formatHoursMinutes(dayTotalSeconds)}</p>
                                </div>
                            </div>
                        </div>
                        <button className="p-project__modal-close" onClick={() => setPickupDate(null)}>
                            <img src="./images/icon_close.svg" alt="閉じる" />
                        </button>
                        <DayRecords date={pickupDate} />
                    </div>
                </div>
            )}
        </div>
    )
}