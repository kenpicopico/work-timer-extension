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

    return {
        dayStartMs,
        dayEndMs,
        daySegments
    }
}