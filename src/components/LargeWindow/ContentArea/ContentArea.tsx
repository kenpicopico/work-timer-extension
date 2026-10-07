import './ContentArea.scss'
import { TodayTab } from './tabs/TodayTab'
import { StatsTab } from './tabs/StatsTab'
import { ProjectDetailTab } from './tabs/ProjectDetailTab'
import { SettingsTab } from './tabs/SettingsTab'
import { type ActiveTab } from '../LargeWindow'

type ContentAreaProps = {
    activeTab : ActiveTab
    viewingProjectId : number | null
}

export function ContentArea({activeTab,viewingProjectId}: ContentAreaProps){
    return (
        <div className='p-content'>
            {activeTab === 'today' && <TodayTab />}
            {activeTab === 'stats' && <StatsTab />}
            {activeTab === 'projectDetail' && viewingProjectId !== null && <ProjectDetailTab viewingProjectId={viewingProjectId} />}
            {activeTab === 'settings' && <SettingsTab />}
        </div>
    )
}