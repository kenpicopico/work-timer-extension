
export function formatElapsedTime(elapsedSeconds : number){
    const hour = Math.floor(elapsedSeconds / 3600)
    const minute = Math.floor((elapsedSeconds % 3600) / 60)
    const second = elapsedSeconds % 60

    const newHour = String(hour).padStart(2, '0')
    const newMinute = String(minute).padStart(2, '0')
    const newSecond = String(second).padStart(2, '0')

    const time = `${newHour}:${newMinute}:${newSecond}`

    return time

}

//秒を時間:分に変換（9000秒　→ 2:30）
export function formatHoursMinutes(totalSeconds : number){
    const hour = Math.floor(totalSeconds / 3600)
    const minute = Math.floor((totalSeconds % 3600) / 60)
    const newHour = String(hour)
    const newMinute = String(minute).padStart(2,'0')
    const time = `${newHour}:${newMinute}`
    return time
}

export const setTimeOfDay = (base:number,hours:number,mimnutes:number):number => {
    const d = new Date(base)
    d.setHours(hours,mimnutes,0,0)
    return d.getTime()
}

//2026/10/14（水）に変形
export function formatDateWithDay(date:Date){
    const day = ['日', '月', '火', '水', '木', '金', '土']
    const thisYear = String(date.getFullYear())
    const thisMonth = String(date.getMonth() + 1).padStart(2, '0')
    const thisDate = String(date.getDate()).padStart(2, '0')
    const thisDay = day[date.getDay()]
    const formattedDate = `${thisYear}/${thisMonth}/${thisDate}（${thisDay}）`
    return formattedDate
}