import { useState } from "react"
import { useProjectContext } from "../../../../contexts/ProjectContext"
import { useSegments } from "../../../../hooks/useSegments"
import { filterSegments, getMonthDates, getMonthPeriod, summarizeSegments } from "../../../../utils/date"
import { formatHoursMinutes } from "../../../../utils/time"
import { DayRecords } from "../../../common/DayRecords"

type ProjectDetailProps = {
    viewingProjectId : number
}

export function ProjectDetailTab({viewingProjectId}:ProjectDetailProps){
    const { projects } = useProjectContext()
    const project = projects.find(project => project.id === viewingProjectId)
    const [ pickupDate, setPickupDate ] = useState<Date | null>(null)

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() +1
    const today = now.getDate()

    const segments = useSegments()

    //合計時間と稼働日数
    const period = getMonthPeriod(year,month)
    const projectsSegments = filterSegments(segments,[viewingProjectId],period)
    const { totalSeconds, workDays } = summarizeSegments(projectsSegments)
    const totalTimeText = formatHoursMinutes(totalSeconds)

    //棒グラフ
    const dailyDatas = getMonthDates(projectsSegments,year,month)
    //カレンダー
    const firstDay = new Date(year, month - 1, 1)
    const startEmptyDays = firstDay.getDay()
    const startEmptyArray = Array(startEmptyDays).fill(null)
    const totalLength = dailyDatas.length + startEmptyDays
    const endEmptyDays = (7 - (totalLength % 7) % 7)
    const endEmptyArray = Array(endEmptyDays).fill(null)



    if(!project){
        return(
            <div>案件が見つかりません</div>
        )
    }
    return (
        <div className="c-content-outer">
            <div className="c-content__head">
                <div className="c-content__head-date">
                    <p className="today">
                        <span style={{ background : project.color}} className="color" />
                        <span className="project-name">{project.name}</span>
                    </p>
                    <div className="buttons">
                        <button className="button"><img src="./images/icon_details.svg" alt="" /></button>
                        <p className="date">{`${month}月`}</p>
                    </div>
                </div>
                <div className="p-project__times">
                    <div className="box">
                        <p className="name">合計<br />時間</p>
                        <p className="number">{totalTimeText}</p>
                    </div>
                    <div className="box">
                        <p className="name">稼働<br />日数</p>
                        <p className="number">{workDays}</p>
                    </div>
                </div>
            </div>

            <div className="c-content">
                <div className="c-content-inner">
                    <div className="p-project__graph">
                        <div className="p-project__graph-bar">
                            { dailyDatas.map(d => {
                                const height = (d.totalSeconds * 4) / 3600
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
                                        <button className="btn" type="button" onClick={() => setPickupDate(cellDate)} disabled={d.date > today}>
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
            </div>
            { pickupDate !== null && (
                <div className="p-project_modal">
                    <div className="p-project_modal-inner">
                        <button className="p-project_modal-close" onClick={() => setPickupDate(null)}>
                            <img src="./images/icon_close.svg" alt="閉じる" />
                        </button>
                        <DayRecords date={pickupDate} />
                    </div>
                </div>
            )}
        </div>
    )
}