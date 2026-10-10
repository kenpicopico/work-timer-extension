import { useEffect, useState } from "react";
import { getSegments, type FinishedSegment } from "../utils/storage";

export function useSegments(){
    const [ segments, setSegments ] = useState<FinishedSegment[]>([])

    useEffect(() => {
        const loadSegments = async () => {
            const loaded = await getSegments()
            setSegments(loaded)
        }
        loadSegments()
    },[])

    useEffect(() =>{
        const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
            if(changes.segments){
                setSegments((changes.segments.newValue) as FinishedSegment[])
            }
        }
        chrome.storage.onChanged.addListener(handleStorageChange)
        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange)
        }
    },[])

    return segments
}