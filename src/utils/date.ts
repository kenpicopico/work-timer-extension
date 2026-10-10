import { type FinishedSegment } from "./storage"

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
export function filterSegments(segments:FinishedSegment[], projectIds:number[], period:Period){
    const projectsSegments = segments.filter(s => projectIds.includes(s.projectId))
    const periodSegments = projectsSegments.filter(s => s.startTime >= period.start && s.startTime < period.end)
    return periodSegments
}

//特定の期間(segments)の合計作業時間、稼働日数を計算
export function summarizeSegments(segments:FinishedSegment[]){
    const durationsMs = segments.map(s => s.endTime - s.startTime)
    const totalSeconds = durationsMs.reduce((sum,p) => sum + p ,0) / 1000

    const days = segments.map(s => {
        const d = new Date(s.startTime)
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    })
    const workDays = new Set(days).size

    return {
        totalSeconds,
        workDays
    }
}

//棒グラフ：特定の月の日毎の作業時間を配列化
export function getMonthDates(segments:FinishedSegment[], year:number,month:number) : { date : number, totalSeconds : number}[]{
    const daysInMonth = new Date(year,month,0).getDate()
    const dates : { date : number, totalSeconds : number}[] = []
    for(let i = 1; i <= daysInMonth; i++){
        dates.push({ date : i, totalSeconds : 0})
    }

    const dailyData = dates.map(d => {
        const day = d.date
        const start = new Date(year,month - 1,day).getTime()
        const end = new Date(year,month - 1,day + 1).getTime()
        const newSegments = segments.filter(s => s.startTime >= start && s.startTime < end).map(s => s.endTime - s.startTime)
        const totalSeconds = newSegments.reduce((sum,s) => sum + s ,0) / 1000
        return {...d, totalSeconds : totalSeconds}
    })

    return dailyData
}
