import './Sidebar.scss'
import { type ActiveTab } from '../LargeWindow'
import { useClientContext } from '../../../contexts/ClientContext'
import { useProjectContext } from "../../../contexts/ProjectContext"
import { useSelectionContext } from '../../../contexts/SelectionContext'
import { useEffect, useState, useRef } from 'react'
import { DeleteConfirmModal } from './DeleteConfirmModal/DeleteConfirmModal'
import { getProjectColors,findUnusedColor } from '../../../utils/color'
import { WarningPopup } from '../../common/WarningPopup'
import { COLOR_PALETTE } from '../../../utils/color'

type SidebarProps = {
    activeTab : ActiveTab
    setActiveTab : (tab:ActiveTab) => void
    viewingProjectId : number | null
    setViewingProjectId : (id:number | null) => void
}

export type DeleteTarget = 
    | { type : 'client', id : number, name : string}
    | { type : 'project', id : number, name : string}
    | null

type SidebarWarning = 'CLIENT_LIMIT' | 'PROJECT_LIMIT'
const SIDEBAR_WARNING_MESSAGES: Record<SidebarWarning, string> = {
    CLIENT_LIMIT: '※クライアントは6件まで登録できます。',
    PROJECT_LIMIT: '※案件は1クライアントにつき8件まで登録できます。',
}

export function Sidebar({activeTab,setActiveTab,viewingProjectId,setViewingProjectId}:SidebarProps){
    const { clients, addClient, renameClient, deleteClient, changeClientColor } = useClientContext()
    const { projects, addProject, renameProject, deleteProject, changeProjectColor } = useProjectContext()
    const { projectId, selectProject } = useSelectionContext()

    const [ editingClientId, setEditingClientId ] = useState<number | null>(null)
    const [ editingProjectId, setEditingProjectId ] = useState<number | null>(null)
    const [ newClientName, setNewClientName ] = useState<string>('')
    const [ newProjectName, setNewProjectName ] = useState<string>('')
    const [ isComposing, setIsComposing ] = useState<boolean>(false)
    const clientInputRef = useRef<HTMLInputElement>(null)
    const projectInputRef = useRef<HTMLInputElement>(null)
    const [ deleteTarget, setDeleteTarget ] = useState<DeleteTarget>(null)
    const [ warning, setWarning ] = useState<SidebarWarning | null>(null)
    const [ openPaletteClientId, setOpenPaletteClientId] = useState<number | null>(null)


    const handleAddClient = () => {
        const alphabets = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

        let newClientName = ''
        for(let i = 0; i < alphabets.length; i++){
            const candidateName = `クライアント${alphabets[i]}`
            const exists = clients.find((client) => client.name === candidateName)
            if(!exists){
                newClientName = candidateName
                break
            }
        }
        const added = addClient(newClientName)
        if (added === null) {
            setWarning('CLIENT_LIMIT')
            return
        }
        handleAddProject(added.id, added.color)
    }

    const handleAddProject = (id:number, color:string) => {
        const alphabets = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

        let newProjectName = ''
        for(let i = 0; i < alphabets.length; i++){
            const candidateName = `案件${alphabets[i]}`
            const exists = projects.find((project) => project.name === candidateName)
            if(!exists){
                newProjectName = candidateName
                break
            }
        }

        const paletteProjects = getProjectColors(color)
        if (paletteProjects === undefined) return

        const usedColors = projects.filter(p => p.clientId === id).map(p => p.color)
        const newColor = findUnusedColor(paletteProjects, usedColors)
        if (newColor === undefined) { 
            setWarning('PROJECT_LIMIT')
            return 
        }

        addProject(newProjectName,id,newColor)
    }

    const handleToggleProjectId = (clientProjectId:number) => {
        setActiveTab('projectDetail')
        setViewingProjectId(clientProjectId)
    }

    //クライアント名編集
    const handleStartEditClient = (e:React.MouseEvent,id:number,name:string) => {
        e.stopPropagation()
        handleConfirmProjectRename()
        setEditingClientId(id)
        setNewClientName(name)
    }
    const handleConfirmClientRename = () => {
        if(editingClientId !== null){
            renameClient(editingClientId,newClientName)
            setEditingClientId(null)
        }
    }

    useEffect(() => {
        const handleClientClickOutside = () => {
            handleConfirmClientRename()
        }
        document.addEventListener('click',handleClientClickOutside)
        return () => {
            document.removeEventListener('click',handleClientClickOutside)
        }
    },[editingClientId, newClientName])

    useEffect(() => {
        if( editingClientId !== null && clientInputRef.current){
            clientInputRef.current.select()
        }
    },[editingClientId])


    //案件名編集
    const handleStartEditProject = (e:React.MouseEvent,id:number,name:string) => {
        e.stopPropagation()
        handleConfirmClientRename()
        setEditingProjectId(id)
        setNewProjectName(name)
    }

    const handleConfirmProjectRename = () => {
        if(editingProjectId !== null){
            renameProject(editingProjectId,newProjectName)
            setEditingProjectId(null)
        }
    }

    useEffect(() => {
        const handleProjectClickOutside = () => {
            handleConfirmProjectRename()
        }
        document.addEventListener('click',handleProjectClickOutside)
        return () => {
            document.removeEventListener('click',handleProjectClickOutside)
        }
    },[editingProjectId, newProjectName])

    useEffect(() => {
        if( editingProjectId !== null && projectInputRef.current){
            projectInputRef.current.select()
        }
    },[editingProjectId])

    //クライアント削除
    const handleDeleteClient = (id:number) => {
        const targetProjects = projects.filter(project => project.clientId === id)
        targetProjects.forEach(project => {
            deleteProject(project.id)
        })
        deleteClient(id)
    }

    const handleTogglePalette = (id:number) => {
        setOpenPaletteClientId(openPaletteClientId === id ? null : id)
    }
    const clientPalette = COLOR_PALETTE.map(cp => cp.client)
    

    return (
        <div className="p-sidebar">
            <button className={`p-sidebar__button ${ activeTab === 'today' ? 'is-selected' : ''}`} onClick={() => setActiveTab('today')}>今日の記録</button>
            <button className={`p-sidebar__button ${ activeTab === 'stats' ? 'is-selected' : ''}`} onClick={() => setActiveTab('stats')}>統計</button>

            <div className='p-sidebar__clients'>
                {clients.map((client) => {
                    const clientsProjects = projects.filter((project) => project.clientId === client.id)
                    const otherClientColors = clients.filter(c => c.id !== client.id).map(c => c.color)
                    return (
                        <div key={client.id}>
                            <p className={`p-sidebar__client-name ${ editingClientId === client.id ? 'is-edit' : ''}`}>
                                <button onClick={() => handleTogglePalette(client.id)}>
                                    <span className='color' style={{ background : client.color }} />
                                </button>
                                {openPaletteClientId === client.id && (
                                    <div className='palette'>
                                        {clientPalette.map(cp => (
                                            <button 
                                                key={cp} 
                                                type='button' 
                                                style={{ background : cp}} 
                                                className={`color ${client.color === cp ? 'is-current' : ''} ${otherClientColors.includes(cp) ? 'is-used' : ''}`} 
                                                onClick={() => {
                                                    const projectColors = getProjectColors(cp)
                                                    if(projectColors === undefined) return
                                                    changeClientColor(client.id,cp)
                                                    changeProjectColor(client.id,projectColors)
                                                    setOpenPaletteClientId(null)
                                                }} 
                                                disabled={client.color === cp || otherClientColors.includes(cp)}
                                            ></button>
                                        ))}
                                    </div>
                                )}
                                { editingClientId === client.id ? (
                                    <input 
                                        className="name"
                                        ref={clientInputRef}
                                        type="text" 
                                        value={newClientName} 
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => setNewClientName(e.target.value)} 
                                        onKeyDown={(e) => {
                                            if(!isComposing && e.key === 'Enter'){
                                                handleConfirmClientRename()
                                            }
                                        }}
                                        onCompositionStart={() => setIsComposing(true)}
                                        onCompositionEnd={() => setIsComposing(false)}
                                    />
                                ):(
                                    <span className='name' onDoubleClick={(e) => handleStartEditClient(e,client.id,client.name)}>{client.name}</span>
                                )}
                                
                                <div className='p-sidebar__client-edits'>
                                    <button className='c-tooltip' data-tooltip="案件の追加" onClick={() => handleAddProject(client.id,client.color)}><img src="./images/icon_plus.svg" alt="" /></button>
                                    <button className='c-tooltip' data-tooltip="名前の編集" onClick={(e) => handleStartEditClient(e,client.id,client.name)}>
                                        <img src="./images/icon_edit.svg" alt="" />
                                    </button>
                                    <button className='c-tooltip' data-tooltip="削除" onClick={() => setDeleteTarget({ type : 'client', id : client.id, name : client.name})}><img src="./images/icon_delete_white.svg" alt="" /></button>
                                </div>
                            </p>
                            <div className='p-sidebar__projects'>
                                {clientsProjects.map((clientProject) => (
                                <button
                                    key={clientProject.id} 
                                    onClick={() => handleToggleProjectId(clientProject.id)} 
                                    className={`p-sidebar__project ${ clientProject.id === viewingProjectId && activeTab === 'projectDetail' ? 'is-selected' : '' } ${ editingProjectId === clientProject.id ? 'is-edit' : ''}`}
                                >
                                    <img 
                                        style={{ visibility : clientProject.id === projectId ? 'visible' : 'hidden'}} 
                                        className='pin' 
                                        src='./images/icon_pin.svg' 
                                    />
                                    <span className='color' style={{background : clientProject.color}} />
                                    {editingProjectId === clientProject.id ? (
                                        <input 
                                            className='name'
                                            type="text" 
                                            ref={projectInputRef}
                                            value={newProjectName} 
                                            onChange={(e) => setNewProjectName(e.target.value)} 
                                            onClick={(e) => e.stopPropagation()} 
                                            onKeyDown={(e) => {
                                                if(!isComposing && e.key === 'Enter'){
                                                    handleConfirmProjectRename()
                                                }
                                            }}
                                            onCompositionStart={() => setIsComposing(true)}
                                            onCompositionEnd={() => setIsComposing(false)}
                                        />
                                    ): (
                                        <span className='name' onDoubleClick={(e) => handleStartEditProject(e,clientProject.id,clientProject.name)}>{clientProject.name}</span>
                                    )}
                                    <div className='p-sidebar__project-edits'>
                                        {clientProject.id !== projectId && (
                                            <button className='c-tooltip' data-tooltip="デフォルトに設定" onClick={() => selectProject(clientProject.id)}><img src="./images/icon_pin.svg" alt="" /></button>
                                        )}
                                        <button className='c-tooltip' data-tooltip="名前の編集" onClick={(e) =>handleStartEditProject(e,clientProject.id,clientProject.name)}><img src="./images/icon_edit.svg" alt="" /></button>
                                        <button className='c-tooltip' data-tooltip="削除" onClick={() => setDeleteTarget({ type : 'project', id : clientProject.id, name : clientProject.name })}><img src="./images/icon_delete_white.svg" alt="" /></button>
                                    </div>
                                </button>
                                ))}
                            </div>
                        </div>
                    )
                })}
                <button className='p-sidebar__client-add' onClick={handleAddClient}><img src="./images/icon_plus.svg" alt="" />クライアントを追加</button>
            </div>

            <div className="p-sidebar__bottom">
                <button className={`p-sidebar__setting ${ activeTab === 'settings' ? 'is-selected' : ''}`} onClick={() => setActiveTab('settings')}>
                    <img src="./images/icon_settings.svg" alt="" />
                    設定
                </button>
                <button className="p-sidebar__login">ログイン</button>
            </div>

            { deleteTarget && (
                <DeleteConfirmModal 
                    deleteTarget={deleteTarget} 
                    setDeleteTarget={setDeleteTarget} 
                    handleDeleteClient={handleDeleteClient} 
                />
                )
            }

            {warning !== null && (
                <WarningPopup
                    message={SIDEBAR_WARNING_MESSAGES[warning]}
                    onClose={() => setWarning(null)}
                />
            )}
        </div>
    )
}