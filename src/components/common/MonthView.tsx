import { useState } from "react"
import { filterSegments, getMonthPeriod, getMonthDates } from "../../utils/date"
import { useSegments } from "../../hooks/useSegments"
import { useProjectContext } from "../../contexts/ProjectContext"
import { formatHoursMinutes,formatDateWithDay } from "../../utils/time"
import { DayRecords } from "./DayRecords"

export type MonthViewProps = {
    year : number
    month : number
    viewingProjectId : number
}

export const MonthView = ({year,month,viewingProjectId}:MonthViewProps) => {
    const { projects } = useProjectContext()
    const project = projects.find(project => project.id === viewingProjectId)
    const [ pickupDate, setPickupDate ] = useState<Date | null>(null)
    const segments = useSegments()
    const now = new Date()
    const today = now.setHours(0,0,0,0)

    //棒グラフ
    const period = getMonthPeriod(year,month)
    const projectsSegments = filterSegments(segments,[viewingProjectId],period)
    const dailyDatas = getMonthDates(projectsSegments,year,month)
    //カレンダー
    const firstDay = new Date(year, month - 1, 1)
    const startEmptyDays = firstDay.getDay()
    const startEmptyArray = Array(startEmptyDays).fill(null)
    const totalLength = dailyDatas.length + startEmptyDays
    const endEmptyDays = (7 - (totalLength % 7)) % 7
    const endEmptyArray = Array(endEmptyDays).fill(null)

    //日毎のモーダル内作業時間表示
    const selectedDatas = getMonthDates(segments,year,month)
    const pickupData = pickupDate === null ? undefined : selectedDatas.find(d => d.date === pickupDate.getDate())
    const dayTotalSeconds = pickupData?.totalSeconds ?? 0

    if(!project){
        return(
            <div>案件が見つかりません</div>
        )
    }
    return (
        <div className="c-content">
            <div className="c-content-inner">
                <div className="p-project__graph">
                    <div className="p-project__graph-bar">
                        { dailyDatas.map(d => {
                            const height = (d.totalSeconds * 6) / 3600
                            const time = formatHoursMinutes(d.totalSeconds)
                            return (
                                <div key={d.date} className="bar">
                                    <span className="bg" style={{ height : `${height}px`, background : project.color}} />
                                    <span className="time">{time}</span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="p-project__graph-date">
                        {dailyDatas.map(d => (
                            <p key={d.date}>{d.date}</p>
                        ))}
                    </div>
                </div>
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
                            return (
                                <div key={d.date} className="box">
                                    <button className="btn" type="button" onClick={() => setPickupDate(cellDate)} disabled={ new Date(year,month -1,d.date).getTime() > today}>
                                        <span className="date">{d.date}</span>
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