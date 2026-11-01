import { useState, useEffect } from 'react';
import { formatDateWithDay } from '../../../../utils/time';
import { DayRecords } from '../../../common/DayRecords';
import { useSegments } from '../../../../hooks/useSegments';
import { summarizeSegments } from '../../../../utils/date';
import { formatHoursMinutes } from '../../../../utils/time';

export function TodayTab(){
    const [ today, setToday ] = useState<Date>(new Date())

    const segments = useSegments()

    const todayMs = new Date(today).setHours(0, 0, 0, 0);
    const tomorrowMs = new Date(today).setHours(24, 0, 0, 0);
    const period = { start : todayMs, end : tomorrowMs }
    const todaySegments = segments.filter(s => s.startTime >= period.start && s.startTime < period.end)
    const { totalSeconds } = summarizeSegments(todaySegments)

    useEffect(() => {
        const nextMidnight = new Date(today)
        nextMidnight.setHours(24, 0, 0, 0)
    
        const msUntilTomorrow = nextMidnight.getTime() - Date.now()
        const timeoutId = setTimeout(() => {
            setToday(new Date())
        }, msUntilTomorrow)
    
        return () => clearTimeout(timeoutId)
    }, [today])


    return (
        <div className="c-content-outer">
            <div className="c-content__head">
                <div className="c-content__head-date">
                    <p className="today">Today</p>
                    <p className="date">{formatDateWithDay(today)}</p>
                </div>
                <div className="p-project__times">
                    <div className="box">
                        <p className="name">合計<br />時間</p>
                        <p className="number">{formatHoursMinutes(totalSeconds)}</p>
                    </div>
                </div>
            </div>

            <div className="c-content">
                <DayRecords date={today} />
            </div>
        </div>
    )
}