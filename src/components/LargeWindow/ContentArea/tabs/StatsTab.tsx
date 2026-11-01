import { useState } from "react"
import { HeaderView, type ViewPeriod } from "../../../common/HeaderView"
import { useProjectContext } from "../../../../contexts/ProjectContext"
import { StatsMonthView } from "../../../common/StatsMonthView"
import { StatsYearView } from "../../../common/StatsYearView"


export function StatsTab(){
    const { projects } = useProjectContext()
    const now = new Date()
    const [ viewPeriod, setViewPeriod ] = useState<ViewPeriod>({ mode: 'month', year: now.getFullYear(), month: now.getMonth() + 1 })
    const viewingProjectId = projects.map(p => p.id)

    return (
        <div className="c-content-outer">
            <HeaderView viewingProjectIds={viewingProjectId} onSelect={(period) => setViewPeriod(period)} type={'stats'}  />

            { viewPeriod.mode === 'month' ? (
                <StatsMonthView year={viewPeriod.year} month={viewPeriod.month} />
            ) : (
                <StatsYearView year={viewPeriod.year} />
            )}

        </div>
    )
}