import { createContext, useEffect, useState, useContext, type ReactNode } from 'react'
import { type Segment, getCurrentSegment, getSessionStartTime } from '../utils/storage'

export type TrackingContextType = {
    currentSegment : Segment | null
    startTracking : (projectId : number) => void
    stopTracking : () => void
    sessionStartTime : number | null
    elapsedSeconds : number
}
export const TrackingContext = createContext<TrackingContextType | undefined>(undefined)

export function useTrackingContext(){
    const context = useContext(TrackingContext)
    if(!context){
        throw new Error ('useTrackingContextはTrackingProviderの中で使ってください')
    }
    return context
}

export type TrackingProviderProps = {
    children : ReactNode
}

export function TrackingProvider({children}:TrackingProviderProps){
    const [ currentSegment, setCurrentSegment] = useState<Segment | null>(null)
    const [ sessionStartTime, setSessionStartTime ] = useState<number | null>(null)
    const [ elapsedSeconds, setElapsedSeconds] = useState<number>(0)

    const startTracking = (projectId:number) => {
        chrome.runtime.sendMessage({
            type : 'SET_ACTIVE_PROJECT',
            projectId : projectId
        })
    }

    const stopTracking = () => {
        chrome.runtime.sendMessage({type : 'STOP_TRACKING'})
    }

    useEffect(() => {
        const loadCurrentSegment = async () => {
            const loaded = await getCurrentSegment()
            setCurrentSegment(loaded)
        }
        loadCurrentSegment()
    },[])

    useEffect(() =>{
        const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
            if(changes.currentSegment){
                setCurrentSegment((changes.currentSegment.newValue) as Segment | null)
            }
            if(changes.sessionStartTime){
                setSessionStartTime((changes.sessionStartTime.newValue) as number | null)
            }
        }
        chrome.storage.onChanged.addListener(handleStorageChange)
        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange)
        }
    },[])

    useEffect(() => {
        const loadSessionStartTime = async () => {
            const loaded = await getSessionStartTime()
            setSessionStartTime(loaded)
        }
        loadSessionStartTime()
    },[])

    useEffect(() => {
        if( sessionStartTime === null){
            setElapsedSeconds(0)
            return
        }
        const intervalId = setInterval(() => {
            const seconds = Math.floor((Date.now() - sessionStartTime) / 1000)
            setElapsedSeconds(seconds)
        },1000)

        return () => {
            clearInterval(intervalId)
        }

    },[sessionStartTime])


    return (
        <TrackingContext.Provider value={{currentSegment, startTracking, stopTracking, sessionStartTime, elapsedSeconds}}>
        {children}
        </TrackingContext.Provider>
    )

}