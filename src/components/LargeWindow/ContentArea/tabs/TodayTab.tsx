import { useState, useEffect } from 'react';
import { formatElapsedTime, formatDateWithDay } from '../../../../utils/time';
import { useTrackingDisplay } from '../../../../hooks/useTrackingDisplay';
import { DayRecords } from '../../../common/DayRecords';

export function TodayTab(){
    const { statusLabel, statusClass, buttonLabel, buttonIcon, buttonAction, showWarning, elapsedSeconds } = useTrackingDisplay()
    const [ today, setToday ] = useState<Date>(new Date())

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
                <div className="p-today__record">
                    <div className="p-today__times">
                        <p className={`status ${statusClass}`}>{statusLabel}</p>
                        <p className="time">{formatElapsedTime(elapsedSeconds)}</p>
                    </div>
                    <button 
                        className={`p-today__button ${statusClass}`} 
                        onClick={buttonAction}
                    >
                        <img src={buttonIcon} alt="" />{buttonLabel}
                    </button>
                </div>
            </div>

            <div className="c-content">
                <DayRecords date={today} />
            </div>
        { showWarning && (
            <div className="p-today__caution">
                <div className="p-today__caution-inner">
                    <button><img src="./images/icon_close.svg" alt="閉じる" /></button>
                    <p>サイドバーから案件を追加してください</p>
                </div>
            </div>
        )}
        </div>
    )
}