export function SettingsTab(){
    return (
        <div className="c-content-outer">
            <div className="p-today__head">
                <div className="p-today__head-date">
                    <p className="today">設定</p>
                    <p className="date">2026/12/12（水）</p>
                </div>
                <div className="p-today__record">
                    <div className="p-today__times is-paused">
                        <p className="status">Paused</p>
                        <p className="time">00:00:00</p>
                    </div>
                    <button className="p-today__button is-paused"><img src="./images/icon_start.svg" alt="" />START</button>
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