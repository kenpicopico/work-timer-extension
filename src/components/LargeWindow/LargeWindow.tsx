import './LargeWindow.scss'
import { Sidebar } from './Sidebar/Sidebar'
import { ContentArea } from './ContentArea/ContentArea'
import { useState, useEffect } from 'react'
import { useProjectContext } from '../../contexts/ProjectContext'

export type ActiveTab = 'today' | 'stats' | 'settings' | 'login' | 'projectDetail'

type LargeWindowProps = {
    onShrink : () => void
}

export function LargeWindow({onShrink}:LargeWindowProps){
    const [activeTab, setActiveTab] = useState<ActiveTab>('today')
    const [viewingProjectId, setViewingProjectId] = useState<number | null>(null)
    const { projects } = useProjectContext()

    useEffect(() => {
        console.log('activeTab:', activeTab)
        console.log('viewingProjectId:', viewingProjectId)
    }, [activeTab, viewingProjectId])

    useEffect(() => {
        if(viewingProjectId === null) return
        const exists = projects.find(project => project.id === viewingProjectId)
        if(!exists){
            setViewingProjectId(null)
            setActiveTab('today')
        }
    },[projects])

    return (
        <>
            <div className='p-large'>
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} viewingProjectId={viewingProjectId} setViewingProjectId={setViewingProjectId} />
                <ContentArea activeTab={activeTab} viewingProjectId={viewingProjectId} />
                <button className='p-large__shrink-button' onClick={onShrink}><img src="./images/icon_expand.svg" alt="" /></button>
            </div>
        </>
    )
}