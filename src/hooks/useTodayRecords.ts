import { useEffect, useState } from "react";
import { useSegments } from "./useSegments";

export function useTodayRecords(){
    const [ today, setToday ] = useState<Date>(new Date())
    const segments = useSegments()

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