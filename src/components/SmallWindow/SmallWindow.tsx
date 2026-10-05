import './SmallWindow.scss'
import { useEffect, useState } from "react";
import { useClientContext } from "../../contexts/ClientContext";
import { useProjectContext } from "../../contexts/ProjectContext"
import { useSelectionContext } from "../../contexts/SelectionContext";
import { useTrackingContext } from '../../contexts/TrackingContext';
import { formatElapsedTime } from '../../utils/time';
import { useTrackingDisplay } from '../../hooks/useTrackingDisplay';

type OpenDropdown = "client" | "project" | null

type SmallWindowProps = {
    onExpand : () => void
}

export function SmallWindow({onExpand}:SmallWindowProps){
    const [ openDropdown, setOpenDropdown ] = useState<OpenDropdown>(null)

    //選択中のクライアントのID
    const [filterClientId, setFilterClientId] = useState<number>(1)

    const { clients } = useClientContext()
    const { projects } = useProjectContext()
    const { projectId, selectProject } = useSelectionContext()
    const { currentSegment, startTracking } = useTrackingContext()
    const { statusLabel, statusClass, buttonLabel, buttonIcon, buttonAction, showWarning, elapsedSeconds } = useTrackingDisplay()

    //クライアントに紐づく案件の配列
    const filteredProjects = projects.filter((project) => project.clientId === filterClientId)

    const handleToggleClient = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setOpenDropdown(openDropdown === 'client' ? null : 'client')
    }
    const handleToggleProject = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setOpenDropdown(openDropdown === 'project' ? null : 'project')
    }

    const selectedClient = clients.find((client) => client.id === filterClientId)
    const selectedProject = projects.find((project) => project.id === projectId)



    useEffect(() => {
        const currentProject = projects.find(project => project.id === projectId)
        if(currentProject){
            setFilterClientId(currentProject.clientId)
        }
    },[projectId])

    useEffect(() => {
        const handleClickOutside = () => {
            setOpenDropdown(null)
        }
        document.addEventListener('click',handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    },[])



    return (

    <div className="p-top__main">
        <section className="p-top__head">
            <div className="c-select">
                <div className={`c-select__outer ${ openDropdown === 'client' ? 'is-open' : ''}`}>
                    <button type="button" onClick={handleToggleClient} className="c-select__trigger" aria-expanded={ openDropdown === 'client' }>
                        <span className="c-select__text">{selectedClient?.name}</span>
                        <span className="c-select__arrow-icon">▾</span>
                    </button>

                    <ul className="c-select__options">
                        {clients.map((client) => (
                            <li 
                                key={client.id} 
                                className={`c-select__option-item ${ client.id === filterClientId ? 'is-selected' : ''}`} 
                                onClick={() => {
                                    setFilterClientId(client.id)
                                    const firstProject = projects.find((project) => project.clientId === client.id)
                                    if(firstProject){
                                        selectProject(firstProject.id)
                                    }
                            }}>
                                {client.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={`c-select__outer ${ openDropdown === 'project' ? 'is-open' : ''}`}>
                    <button type="button" onClick={handleToggleProject} className="c-select__trigger" aria-expanded={ openDropdown === 'project' }>
                        <span className="c-select__text">{selectedProject?.name}</span>
                        <span className="c-select__arrow-icon">▾</span>
                    </button>

                    <ul className="c-select__options">
                        {filteredProjects.map((filteredProject) => (
                            <li 
                                key={filteredProject.id} 
                                className={`c-select__option-item ${ filteredProject.id === projectId ? 'is-selected' : ''}`} 
                                onClick={() => {
                                    selectProject(filteredProject.id)
                                    if(currentSegment !== null){
                                        startTracking(filteredProject.id)
                                    }
                                }}>
                                {filteredProject.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <button className="p-top__link c-tooltip" data-tooltip="詳細" onClick={onExpand}><img src="./images/icon_open.svg" alt="開く" /></button>
        </section>
        <section className="p-top__bottom">
            <div className="p-top__times">
                <p className={`status ${statusClass}`}>{statusLabel}</p>
                <p className="time">{formatElapsedTime(elapsedSeconds)}</p>
            </div>
            <button 
                className={`p-top__button ${statusClass}`} 
                onClick={buttonAction}
            >
                <img src={buttonIcon} alt="" />{buttonLabel}
            </button>
        </section>
        { showWarning && (
            <div className="p-top__caution">
                <div className="p-top__caution-inner">
                    <button><img src="./images/icon_close.svg" alt="" /></button>
                    <p>詳細ページ（<img src="./images/icon_open.svg" alt="" />）から<br />案件を追加してください</p>
                </div>
            </div>
        )}
    </div>
    )
}