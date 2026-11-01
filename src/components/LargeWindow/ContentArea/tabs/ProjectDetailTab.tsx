import { useState } from "react"
import { MonthView } from "../../../common/MonthView"
import { YearView } from "../../../common/YearView"
import { HeaderView, type ViewPeriod } from "../../../common/HeaderView"

type ProjectDetailProps = {
    viewingProjectId : number
}

export function ProjectDetailTab({viewingProjectId}:ProjectDetailProps){
    const now = new Date()
    const [ viewPeriod, setViewPeriod] = useState<ViewPeriod>({ mode : 'month', year : now.getFullYear(), month : now.getMonth() + 1})

    return (
        <div className="c-content-outer">
            <HeaderView viewingProjectIds={[viewingProjectId]} onSelect={(period) => setViewPeriod(period)} type={'project'} />

            { viewPeriod.mode === 'month' ? (
                <MonthView year={viewPeriod.year} month={viewPeriod.month} viewingProjectId={viewingProjectId} />
            ) : (
                <YearView year={viewPeriod.year} viewingProjectId={viewingProjectId} />
            )}
        </div>
    )
}