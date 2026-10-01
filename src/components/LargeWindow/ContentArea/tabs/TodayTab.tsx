
import { formatElapsedTime, formatHoursMinutes } from '../../../../utils/time';
import { useTrackingDisplay } from '../../../../hooks/useTrackingDisplay';
import { useTodayRecords } from '../../../../hooks/useTodayRecords';
import { useProjectContext } from '../../../../contexts/ProjectContext';
import { useClientBreakdown } from '../../../../hooks/useClientBreakdown';

export function TodayTab(){
    const { statusLabel, statusClass, buttonLabel, buttonIcon, buttonAction, showWarning, elapsedSeconds } = useTrackingDisplay()
    const { todayStartMs, todaySegments, formattedDate} = useTodayRecords()
    const { projects } = useProjectContext()
    const { clientBreakdown } = useClientBreakdown(todaySegments)

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
                            <li className="item">
                                <span style={{'background':'#FF0000'}} className="color" />
                                <div className="start">
                                    <div className='box'>
                                        <button type='button'>10</button>
                                        <ul className='selects'>
                                            <li>00</li>
                                            <li>01</li>
                                            <li>02</li>
                                            <li>03</li>
                                            <li>04</li>
                                            <li>05</li>
                                            <li>06</li>
                                            <li>07</li>
                                            <li>08</li>
                                            <li>09</li>
                                            <li>10</li>
                                            <li>11</li>
                                            <li>12</li>
                                            <li>13</li>
                                            <li>14</li>
                                            <li>15</li>
                                            <li>16</li>
                                            <li>17</li>
                                            <li>18</li>
                                            <li>19</li>
                                            <li>20</li>
                                            <li>21</li>
                                            <li>22</li>
                                            <li>23</li>
                                        </ul>
                                    </div>
                                    <span className="colon">:</span>
                                    <input className="minute" type="number" />
                                </div>
                                <span className="separate">〜</span>
                                <div className="finish">
                                    <input className="hour" type="number" />
                                    <span className="colon">:</span>
                                    <input className="minute" type="number" />
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
                            <li className="item">
                                <span style={{'background':'#FF0000'}} className="color" />
                                <div className="start">
                                    <input className="hour" type="number" />
                                    <span className="colon">:</span>
                                    <input className="minute" type="number" />
                                </div>
                                <span className="separate">〜</span>
                                <div className="finish">
                                    <input className="hour" type="number" />
                                    <span className="colon">:</span>
                                    <input className="minute" type="number" />
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