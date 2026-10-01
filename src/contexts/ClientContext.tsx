import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type Client = {
    id:number
    name:string
    color:string
}

export type ClientContextType = {
    clients: Client[]
    addClient: (name:string) => { id: number, color: string }
    renameClient: (id:number,name:string)  => void
    deleteClient: (id:number) => void
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

    const addClient = (name: string): { id: number, color: string } => {
        const newId = Date.now()
        const colorPalette = ['#FF0000', '#FBFF00', '#0DFF00', '#005DFF', '#AA00FF', '#FF00EE', '#C2C2C2']
        let newColor = colorPalette[0]
        for(let i = 0 ; i < colorPalette.length; i++){
            const candidateColor = colorPalette[i]
            const exists = clients.find((client) => client.color === candidateColor)
            if(!exists){
                newColor = candidateColor
                break
            }
        }
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

    useEffect(() => {
        console.log('clients:', clients)
    },[clients])
    
    return (
        <ClientContext.Provider value={{clients,addClient,renameClient,deleteClient}}>
            {children}
        </ClientContext.Provider>
    )
}
