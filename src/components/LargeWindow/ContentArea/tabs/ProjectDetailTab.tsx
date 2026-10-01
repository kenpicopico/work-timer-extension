import { useProjectContext } from "../../../../contexts/ProjectContext"

type ProjectDetailProps = {
    viewingProjectId : number | null
}

export function ProjectDetailTab({viewingProjectId}:ProjectDetailProps){
    const { projects } = useProjectContext()
    const project = projects.find(project => project.id === viewingProjectId)

    if(!project){
        return(
            <div>案件が見つかりません</div>
        )
    }

    return (
        <div className="c-content-outer">
            <div className="c-content__head">
                <div className="c-content__head-date">
                    <p className="today"><span style={{ background : '#4689FF'}} className="color" />{project.name}</p>
                    <div className="buttons">
                        <button className="button"><img src="./images/icon_details.svg" alt="" /></button>
                        <p className="date">12月</p>
                    </div>
                </div>
                <div className="p-project__times">
                    <div className="box">
                        <p className="name">合計<br />時間</p>
                        <p className="number">7:00</p>
                    </div>
                    <div className="box">
                        <p className="name">稼働<br />日数</p>
                        <p className="number">20</p>
                    </div>
                </div>
            </div>

            <div className="c-content">
                <div className="c-content-inner">
                    <div></div>
                    <ul className="p-today__bd">
                        <li className="p-today__bd-item">
                            <span style={{'background':'#FF0000'}} className="client-color" />
                            4:30
                            <span className="brackets">（</span>
                            <ul className="p-today__bd-projects">
                                <li className="project">
                                    <span style={{'background':'#FF4E4E'}} className="project-color" />
                                    2:30
                                </li>
                                <li className="project">
                                    <span style={{'background':'#FF8383'}} className="project-color" />
                                    2:00
                                </li>
                            </ul>
                            <span>）</span>
                        </li>
                        <li className="p-today__bd-item">
                            <span style={{'background':'#005DFF'}} className="client-color" />
                            7:00
                            <span className="brackets">（</span>
                            <ul className="p-today__bd-projects">
                                <li className="project">
                                    <span style={{'background':'#4689FF'}} className="project-color" />
                                    7:00
                                </li>
                            </ul>
                            <span>）</span>
                        </li>
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
        </div>
    )
}