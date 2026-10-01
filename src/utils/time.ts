
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

export function formatHoursMinutes(totalSeconds : number){
    const hour = Math.floor(totalSeconds / 3600)
    const minute = Math.floor((totalSeconds % 3600) / 60)
    const newHour = String(hour)
    const newMinute = String(minute).padStart(2,'0')
    const time = `${newHour}:${newMinute}`
    return time
}