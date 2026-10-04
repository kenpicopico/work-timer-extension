import { useEffect, useState } from "react";
import { getSegments, type Segment } from "../utils/storage";

export function useTodayRecords(){
    const [ today, setToday ] = useState<Date>(new Date())
    const [ segments, setSegments ] = useState<Segment[]>([])

    const todayStart = new Date(today)
    todayStart.setHours(0,0,0,0)

    const todayEnd = new Date(todayStart)
    todayEnd.setDate(todayStart.getDate() + 1)

    useEffect(()=> {
        const msUntilTomomrrow = todayEnd.getTime() - Date.now()
        const timeoutId = setTimeout(() => {
            setToday(new Date())
        },msUntilTomomrrow)
        return () => {
            clearTimeout(timeoutId)
        }
    },[today])

    const todayStartMs = todayStart.getTime()
    const todayEndMs = todayEnd.getTime()
    const todaySegments = segments.filter((segment) => segment.startTime >= todayStartMs && segment.startTime < todayEndMs).sort((a, b) => a.startTime - b.startTime)

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
                setSegments((changes.segments.newValue) as Segment[])
            }
        }
        chrome.storage.onChanged.addListener(handleStorageChange)
        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange)
        }
    },[])

    const day = ['日', '月', '火', '水', '木', '金', '土']
    const thisYear = String(today.getFullYear())
    const thisMonth = String(today.getMonth() + 1).padStart(2, '0')
    const thisDate = String(today.getDate()).padStart(2, '0')
    const thisDay = day[today.getDay()]
    const formattedDate = `${thisYear}/${thisMonth}/${thisDate}（${thisDay}）`



    return {
        todayStartMs,
        todayEndMs,
        todaySegments,
        formattedDate
    }
}