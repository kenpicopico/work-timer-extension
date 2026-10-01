import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useProjectContext } from "./ProjectContext";

export type SelectionContextType = {
    projectId: number | null
    selectProject: (id:number) => void
}

export const SelectionContext = createContext<SelectionContextType | undefined>(undefined)

export function useSelectionContext(){
    const context = useContext(SelectionContext)
    if(!context){
        throw new Error ('useSelectionContextはSelectionProviderの中で使ってください')
    }
    return context
}

export type SelectionProviderProps = {
    children : ReactNode
}

export function SelectionProvider({children}:SelectionProviderProps){
    const [projectId, setProjectId] = useState<number | null>(101)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const { projects } = useProjectContext()

    const selectProject = (id:number) => {
        setProjectId(id)
    }

    useEffect(() => {
        const loadProjectId = async () => {
            const result = await chrome.storage.local.get('selectedProjectId')
            const loaded = (result.selectedProjectId ?? 101) as number
            setProjectId(loaded)
            setIsLoaded(true)
        }
        loadProjectId()
    },[])

    useEffect(() => {
        if(!isLoaded) return
        const setLocalProjectId = async () => {
            await chrome.storage.local.set({ 'selectedProjectId' : projectId })
        }
        setLocalProjectId()
    },[projectId, isLoaded])

    useEffect(() => {
        const exists = projects.find(project => project.id === projectId)
        console.log('projects:',projects)
        if(!exists){
            if(projects.length === 0){
                setProjectId(null)
            } else {
                setProjectId(projects[0].id)
                console.log('projects[0].id:',projects[0].id)
            }
        }
    },[projects])

    useEffect(() => {
        console.log('projectId:', projectId)
    },[projectId])

    return (
        <SelectionContext.Provider value={{projectId,selectProject}}>
            {children}
        </SelectionContext.Provider>
    )
}