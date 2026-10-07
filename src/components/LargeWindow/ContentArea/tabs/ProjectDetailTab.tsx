import { useProjectContext } from "../../../../contexts/ProjectContext"
import { useSegments } from "../../../../hooks/useSegments"
import { filterSegments, getMonthPeriod, summarizeSegments } from "../../../../utils/date"
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

    const segments = useSegments()

    //合計時間と稼働日数
    const period = getMonthPeriod(year,month)
    const projectsSegments = filterSegments(segments,[viewingProjectId],period)
    const { totalSeconds, workDays } = summarizeSegments(projectsSegments)
    const totalTimeText = formatHoursMinutes(totalSeconds)

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
                            <div className="bar"><span style={{ height : '4px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '8px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '12px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '16px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '20px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '24px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '28px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '32px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '36px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '40px', background : project.color}} /></div>

                            <div className="bar"><span style={{ height : '44px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '48px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '32px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '32px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '28px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '20px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '0px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '32px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '32px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '0px', background : project.color}} /></div>

                            <div className="bar"><span style={{ height : '0px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '24px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '28px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '32px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '32px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '96px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '8px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '12px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '36px', background : project.color}} /></div>
                            <div className="bar"><span style={{ height : '0px', background : project.color}} /></div>

                            <div className="bar"><span style={{ height : '32px', background : project.color}} /></div>
                        </div>
                        <div className="p-project__graph-date">
                            <p>1</p>
                            <p>2</p>
                            <p>3</p>
                            <p>4</p>
                            <p>5</p>
                            <p>6</p>
                            <p>7</p>
                            <p>8</p>
                            <p>9</p>
                            <p>10</p>
                            <p>11</p>
                            <p>12</p>
                            <p>13</p>
                            <p>14</p>
                            <p>15</p>
                            <p>16</p>
                            <p>17</p>
                            <p>18</p>
                            <p>19</p>
                            <p>20</p>
                            <p>21</p>
                            <p>22</p>
                            <p>23</p>
                            <p>24</p>
                            <p>25</p>
                            <p>26</p>
                            <p>27</p>
                            <p>28</p>
                            <p>29</p>
                            <p>30</p>
                            <p>31</p>
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
                            <div className="box">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}