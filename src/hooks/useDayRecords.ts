import { useSegments } from "./useSegments";

export function useDayRecords(date:Date){
    const segments = useSegments()

    const dayStart = new Date(date)
    dayStart.setHours(0,0,0,0)

    const dayEnd = new Date(dayStart)
    dayEnd.setDate(dayStart.getDate() + 1)

    const dayStartMs = dayStart.getTime()
    const dayEndMs = dayEnd.getTime()
    const daySegments = segments.filter((segment) => segment.startTime >= dayStartMs && segment.startTime < dayEndMs).sort((a, b) => a.startTime - b.startTime)



    const day = ['日', '月', '火', '水', '木', '金', '土']
    const thisYear = String(date.getFullYear())
    const thisMonth = String(date.getMonth() + 1).padStart(2, '0')
    const thisDate = String(date.getDate()).padStart(2, '0')
    const thisDay = day[date.getDay()]
    const formattedDate = `${thisYear}/${thisMonth}/${thisDate}（${thisDay}）`



    return {
        dayStartMs,
        dayEndMs,
        daySegments,
        formattedDate
    }
}