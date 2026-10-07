import { type Segment, type FinishedSegment } from "./storage"

export type Period = { start : number, end : number }


//特定の月のPeriodを作成
export function getMonthPeriod(year:number, month:number): Period{
    const start = new Date(year, month - 1, 1).getTime()
    const end = new Date(year, month, 1).getTime()
    return { start : start, end : end }
}
//特定の年のPeriodを作成
export function getYearPeriod(year:number): Period{
    const start = new Date(year, 0, 1).getTime()
    const end = new Date(year + 1, 0, 1).getTime()
    return { start : start, end : end }
}

//案件（or複数の案件）の特定の期間のsegmentsを作成
export function filterSegments(segments:Segment[], projectIds:number[], period:Period){
    const projectsSegments = segments.filter(s => projectIds.includes(s.projectId))
    const periodSegments = projectsSegments.filter(s => s.startTime >= period.start && s.startTime < period.end)
    return periodSegments
}

//特定の期間(segments)の合計作業時間、稼働日数を計算
export function summarizeSegments(segments:Segment[]){
    const finished = segments.filter((s) : s is FinishedSegment => s.endTime !== null)
    const durationsMs = finished.map(s => s.endTime - s.startTime)
    const totalSeconds = durationsMs.reduce((sum,p) => sum + p ,0) / 1000

    const days = finished.map(f => {
        const d = new Date(f.startTime)
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    })
    const workDays = new Set(days).size

    return {
        totalSeconds,
        workDays
    }
}
