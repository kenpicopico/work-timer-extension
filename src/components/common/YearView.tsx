import { getYearPeriod, filterSegments, getYearDates, getMonthPeriod, summarizeSegments } from "../../utils/date"
import { formatHoursMinutes } from "../../utils/time"
import { useProjectContext } from "../../contexts/ProjectContext"
import { useSegments } from "../../hooks/useSegments"

export type YearViewProps = {
    year : number
    viewingProjectId : number
}

export const YearView = ({year, viewingProjectId}:YearViewProps) => {
    const { projects } = useProjectContext()
    const project = projects.find(project => project.id === viewingProjectId)
    const segments = useSegments()
    //棒グラフ
    const period = getYearPeriod(year)
    const projectsSegments = filterSegments(segments,[viewingProjectId],period)
    const monthlyDatas = getYearDates(projectsSegments,year)

    const firstHalfDates = monthlyDatas.filter(d => d.date <= 6 )
    const secondHalfDates = monthlyDatas.filter(d => d.date > 6 )
    if(!project){
        return(
            <div>案件が見つかりません</div>
        )
    }
    return (
        <div className="c-content">
            <div className="c-content-inner">
                <div className="p-project__year-graph">
                    <div className="p-project__year-graph-bar">
                        { monthlyDatas.map(d => {
                            const height = (d.totalSeconds * 1) / 3600
                            const time = formatHoursMinutes(d.totalSeconds)
                            return (
                                <div key={d.date} className="bar">
                                    <span className="bg" style={{ height : `${height}px`, background : project.color}} />
                                    <span className="time">{time}</span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="p-project__year-graph-date">
                        {monthlyDatas.map(d => (
                            <p key={d.date}>{d.date}</p>
                        ))}
                    </div>
                </div>

                <div className="p-project__year-tables">
                    <div className="table-box">
                        <ul className="table-head">
                            <li className="table-month">月</li>
                            <li className="table-total">合計時間</li>
                            <li className="table-days">稼働日数</li>
                            <li className="table-aberage">1日平均</li>
                        </ul>
                        <ul className="table-data">
                            {firstHalfDates.map(d => {
                                const time = d.totalSeconds === 0 ? '-' : formatHoursMinutes(d.totalSeconds)
                                const period = getMonthPeriod(year,d.date)
                                const monthSegments = filterSegments(segments,[viewingProjectId],period)
                                const { totalSeconds, workDays } = summarizeSegments(monthSegments)
                                const average = totalSeconds === 0 ? '-' : formatHoursMinutes(totalSeconds / workDays)
                                return (
                                    <li className="table-item">
                                        <div className="table-month">{d.date}</div>
                                        <div className="table-total">{time}</div>
                                        <div className="table-days">{workDays === 0 ? '-' : workDays}</div>
                                        <div className="table-aberage">{average}</div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="table-box">
                        <ul className="table-head">
                            <li className="table-month">月</li>
                            <li className="table-total">合計時間</li>
                            <li className="table-days">稼働日数</li>
                            <li className="table-aberage">1日平均</li>
                        </ul>
                        <ul className="table-data">
                            {secondHalfDates.map(d => {
                                const time = d.totalSeconds === 0 ? '-' : formatHoursMinutes(d.totalSeconds)
                                const period = getMonthPeriod(year,d.date)
                                const monthSegments = filterSegments(segments,[viewingProjectId],period)
                                const { totalSeconds, workDays } = summarizeSegments(monthSegments)
                                const average = totalSeconds === 0 ? '-' : formatHoursMinutes(totalSeconds / workDays)
                                return (
                                    <li className="table-item">
                                        <div className="table-month">{d.date}</div>
                                        <div className="table-total">{time}</div>
                                        <div className="table-days">{workDays === 0 ? '-' : workDays}</div>
                                        <div className="table-aberage">{average}</div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}