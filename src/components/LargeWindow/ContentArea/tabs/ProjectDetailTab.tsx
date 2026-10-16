import { useEffect, useRef, useState } from "react"
import { useProjectContext } from "../../../../contexts/ProjectContext"
import { useSegments } from "../../../../hooks/useSegments"
import { filterSegments, getMonthPeriod, getYearPeriod, summarizeSegments } from "../../../../utils/date"
import { formatHoursMinutes } from "../../../../utils/time"
import { MonthView } from "../../../common/MonthView"
import { YearView } from "../../../common/YearView"

type ProjectDetailProps = {
    viewingProjectId : number
}

type ViewPeriod = 
    | { mode : 'month', year : number, month : number}
    | { mode : 'year',  year : number }

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)

export function ProjectDetailTab({viewingProjectId}:ProjectDetailProps){
    const ref = useRef<HTMLDivElement | null>(null)
    const { projects } = useProjectContext()
    const project = projects.find(project => project.id === viewingProjectId)
    const [ isOpen, setIsOpen ] = useState<boolean>(false)

    const now = new Date()
    const [ viewPeriod, setViewPeriod] = useState<ViewPeriod>({ mode : 'month', year : now.getFullYear(), month : now.getMonth() + 1})
    const [ pickerYear, setPickerYear ] = useState<number>(viewPeriod.year)

    const segments = useSegments()

    //合計時間と稼働日数
    const period = viewPeriod.mode === 'month'
    ? getMonthPeriod(viewPeriod.year, viewPeriod.month)
    : getYearPeriod(viewPeriod.year)
    const projectsSegments = filterSegments(segments,[viewingProjectId],period)
    const { totalSeconds, workDays } = summarizeSegments(projectsSegments)

    useEffect(() => {
        const handleOutside = (e:MouseEvent) => {
            if(ref.current && !ref.current.contains(e.target as Node)){
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown',handleOutside)
        return () => document.removeEventListener('mousedown',handleOutside)
    },[])

    if(!project){
        return(
            <div>案件が見つかりません</div>
        )
    }
    return (
        <div className="c-content-outer">
            <div className="c-content__head">
                <div className="c-content__head-date">
                    <p className="today">
                        <span style={{ background : project.color}} className="color" />
                        <span className="project-name">{project.name}</span>
                    </p>
                    <div className="buttons">
                        <button className="button" onClick={() => {
                            setIsOpen(!isOpen)
                            setPickerYear(viewPeriod.year)
                        }}><img src="./images/icon_details.svg" alt="" /></button>
                        <p className="date">
                            {viewPeriod.mode === 'month' ? `${viewPeriod.year}年${viewPeriod.month}月` : `${viewPeriod.year}年`}</p>
                        { isOpen && (
                            <div ref={ref} className="p-project__period">
                                <div className="p-project__period-year">
                                    <button onClick={() => setPickerYear(prev => prev -1)} className="prev">
                                        <img src="./images/icon_details.svg" alt="" />
                                    </button>
                                    <p className="year">{`${pickerYear}年`}</p>
                                    <button onClick={() => setPickerYear(prev => prev +1)} className="next"><img src="./images/icon_details.svg" alt="" /></button>
                                </div>
                                <div className="p-project__period-month">
                                    {MONTHS.map(m => (
                                        <button key={m} onClick={() => {
                                            setIsOpen(false)
                                            setViewPeriod({ mode : 'month',year : pickerYear, month : m })
                                        }}>{`${m}月`}</button>
                                    ))}
                                </div>
                                <button className="p-project__period-thisyear" onClick={() => {
                                    setIsOpen(false)
                                    setViewPeriod({ mode : 'year',year : pickerYear })
                                }}>{`${pickerYear}年`}</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-project__times">
                    <div className="box">
                        <p className="name">合計<br />時間</p>
                        <p className="number">{formatHoursMinutes(totalSeconds)}</p>
                    </div>
                    <div className="box">
                        <p className="name">稼働<br />日数</p>
                        <p className="number">{workDays}</p>
                    </div>
                </div>
            </div>
            { viewPeriod.mode === 'month' ? (
                <MonthView year={viewPeriod.year} month={viewPeriod.month} viewingProjectId={viewingProjectId} />
            ) : (
                <YearView year={viewPeriod.year} viewingProjectId={viewingProjectId} />
            )}
        </div>
    )
}