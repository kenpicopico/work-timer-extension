import { useProjectContext } from "../../../../contexts/ProjectContext"
import { useSegments } from "../../../../hooks/useSegments"
import { filterSegments, getMonthDates, getMonthPeriod, summarizeSegments } from "../../../../utils/date"
import { formatHoursMinutes } from "../../../../utils/time"

type ProjectDetailProps = {
    viewingProjectId : number
}

export function ProjectDetailTab({viewingProjectId}:ProjectDetailProps){
    const { projects } = useProjectContext()
    const project = projects.find(project => project.id === viewingProjectId)

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
                                return (
                                    <div key={d.date} className="box">
                                        <button className="btn" type="button" disabled={d.date > today}>
                                            <span className="date">{d.date}</span>
                                            <p className="working-time">{d.totalSeconds > 0 && time}</p>
                                        </button>
                                    </div>
                                )
                            })}
                            {endEmptyArray.map((_,index) => (
                                <div key={index} className="box" />
                            ))}
                            
                            {/* <div className="box">
                            </div>
                            <div className="box">
                            </div>
                            <div className="box">
                            </div>
                            <div className="box">
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">1</span>
                                    <p className="working-time">4:00</p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">2</span>
                                    <p className="working-time">3:00</p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">3</span>
                                    <p className="working-time"></p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">4</span>
                                    <p className="working-time"></p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">5</span>
                                    <p className="working-time"></p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">6</span>
                                    <p className="working-time">4:00</p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">7</span>
                                    <p className="working-time">4:00</p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">8</span>
                                    <p className="working-time">4:00</p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">9</span>
                                    <p className="working-time">4:00</p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">10</span>
                                    <p className="working-time">4:00</p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">11</span>
                                    <p className="working-time">4:00</p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">12</span>
                                    <p className="working-time">3:00</p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">13</span>
                                    <p className="working-time"></p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">14</span>
                                    <p className="working-time"></p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">15</span>
                                    <p className="working-time"></p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">16</span>
                                    <p className="working-time">4:00</p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">17</span>
                                    <p className="working-time">4:00</p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">18</span>
                                    <p className="working-time">4:00</p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">19</span>
                                    <p className="working-time">4:00</p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">20</span>
                                    <p className="working-time">4:00</p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">21</span>
                                    <p className="working-time">4:00</p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">22</span>
                                    <p className="working-time">3:00</p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">23</span>
                                    <p className="working-time"></p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">24</span>
                                    <p className="working-time"></p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">25</span>
                                    <p className="working-time"></p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">26</span>
                                    <p className="working-time">4:00</p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">27</span>
                                    <p className="working-time">4:00</p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">28</span>
                                    <p className="working-time">4:00</p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">29</span>
                                    <p className="working-time">4:00</p>
                                </button>
                            </div>
                            <div className="box">
                                <button className="btn" type="button">
                                    <span className="date">30</span>
                                    <p className="working-time">4:00</p>
                                </button>
                            </div>
                            <div className="box">
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}