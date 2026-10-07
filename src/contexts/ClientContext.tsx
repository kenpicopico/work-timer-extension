import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { COLOR_PALETTE, findUnusedColor } from "../utils/color"

export type Client = {
    id:number
    name:string
    color:string
}

export type ClientContextType = {
    clients: Client[]
    addClient: (name:string) => { id: number, color: string } | null
    renameClient: (id:number,name:string)  => void
    deleteClient: (id:number) => void
    changeClientColor: (id:number, color:string) => void
}

export const ClientContext = createContext<ClientContextType | undefined>(undefined)

export function useClientContext(){
    const context = useContext(ClientContext)
    if(!context){
        throw new Error ('useClientContextはClientProviderの中で使ってください')
    }
    return context
}

export type ClientProviderProps = {
    children : ReactNode
}

export function ClientProvider({children}:ClientProviderProps){
    const [clients, setClients] = useState<Client[]>([])
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    const addClient = (name: string): { id: number, color: string } | null => {
        const newId = Date.now()
        const colors = clients.map(c => c.color)
        const colorPalette = COLOR_PALETTE.map(p => p.client)
        const newColor = findUnusedColor(colorPalette, colors)
        if (newColor === undefined) return null

        const newClient = { id : newId, name : name, color : newColor}
        setClients(prev => [...prev, newClient])
        return {
            id : newId,
            color : newColor
        }
    }

    const renameClient = (id:number,name:string) => {
        setClients(prev => prev.map(client => client.id === id ? {...client, name:name} : client ))
    }

    const deleteClient = (id:number) => {
        setClients(prev => prev.filter(client => client.id !== id))
    }

    const changeClientColor = (id:number, color:string) => {
        setClients(prev => prev.map(client => client.id === id ? {...client, color:color} : client))
    }

    useEffect(() => {
        const loadClients = async () => {
            const result = await chrome.storage.local.get('clients')
            const loaded = (result.clients ?? [{ id : 1, name : 'クライアントA', color : '#FF0000'}]) as Client[]
            setClients(loaded)
            setIsLoaded(true)
        }
        loadClients()
    },[])

    useEffect(() => {
        if(!isLoaded) return
        const setLocalClients = async () => {
            await chrome.storage.local.set({
                'clients':clients
            })
        }
        setLocalClients()
    },[clients,isLoaded])
    
    return (
        <ClientContext.Provider value={{clients,addClient,renameClient,deleteClient,changeClientColor}}>
            {children}
        </ClientContext.Provider>
    )
}
