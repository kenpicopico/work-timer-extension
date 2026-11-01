import { useClientContext } from "../../contexts/ClientContext"
import { useProjectContext } from "../../contexts/ProjectContext"
import { useSegments } from "../../hooks/useSegments"
import { formatHoursMinutes } from "../../utils/time"
import { getYearPeriod, filterSegments, getYearDates, getMonthPeriod, summarizeSegments } from "../../utils/date"

type StatsYearViewProps = {
    year : number
}

type ClientTabelData = {
    id : number
    name : string
    color : string
    yearTotalSeconds : number
    workDays : number
    data : {
        date : number
        totalSeconds : number
    }[]
}

export function StatsYearView({year} : StatsYearViewProps){
    const { clients } = useClientContext()
    const { projects } = useProjectContext()
    const segments = useSegments()

    //棒グラフ
    const date : { 
        date : number, 
        clients : { 
            clientId : number, 
            clientName : string, 
            clientColor : string, 
            totalSeconds : number
        }[]
    }[] = []
    const newClients = clients.map(c => {
        return {
            clientId : c.id, 
            clientName : c.name, 
            clientColor : c.color, 
            totalSeconds : 0
        }
    })
    for(let i = 1; i <= 12; i++){
        date.push({ date : i, clients : newClients})
    }

    const monthlyGraphDatas = date.map(d => {
        const month = d.date
        const start = new Date(year,month - 1,1).getTime()
        const end = new Date(year,month,1).getTime()
        const newSegments = segments.filter(s => s.startTime >= start && s.startTime < end)
        const projectBreakdown = projects.map(project => {
            const projectSegments = newSegments.filter(s => s.projectId === project.id)
            let totalSeconds = 0
            for(let i = 0; i < projectSegments.length; i++){
                const segment = projectSegments[i]
                totalSeconds += (segment.endTime - segment.startTime) / 1000
            }
            return {
                clientId : project.clientId,
                projectId : project.id,
                projectColor : project.color,
                totalSeconds
            }
        })
        const clientBreakdown = clients.map(c => {
            const clientProjects = projectBreakdown
                .filter(pb => pb.clientId === c.id)
                .map(pb => pb.totalSeconds)
            const totalSeconds = clientProjects.reduce((sum,cp) => sum + cp ,0)
            return {
                clientId : c.id,
                clientName : c.name,
                clientColor : c.color,
                totalSeconds
            }
        })
        return {
            date : d.date, 
            clients : clientBreakdown
        }
    })

    //表

    const clientTabelData : ClientTabelData[] = clients.map(client => {
        const period = getYearPeriod(year)
        const projectIds = projects.filter(p => client.id === p.clientId).map(p => p.id)
        const projectsSegments = filterSegments(segments,projectIds,period)
        const monthlyData = getYearDates(projectsSegments,year)
        const segmentsMs = projectsSegments.map(ps => ps.endTime - ps.startTime)
        const yearTotalSeconds = segmentsMs.reduce((sum,i) => sum + i ,0) / 1000
        const { workDays } = summarizeSegments(projectsSegments)
        return {
            id : client.id,
            name : client.name,
            color : client.color,
            yearTotalSeconds : yearTotalSeconds,
            workDays : workDays,
            data : monthlyData
        }
    })

    return (
        <div className="c-content">
            <div className="p-stats__year-inner">
                <div className="p-stats__year-graph">
                    <div className="p-stats__year-graph-bar">
                        {monthlyGraphDatas.map(d => (
                            <div key={d.date} className="bars">
                                {d.clients.map(c => {
                                    const totalSeconds = formatHoursMinutes(c.totalSeconds)
                                    const height = (c.totalSeconds * 1) / 3600
                                    if(c.totalSeconds === 0) return
                                    return (
                                        <div key={c.clientId} className="bar">
                                            <span className="bg" style={{ height : `${height}px`, background : `${c.clientColor}`}} />
                                            <span className="time">{totalSeconds}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                    <div className="p-stats__year-graph-date">
                        <p>1</p>
                        <p>2</p>
                        <p>3</p>
                        <p>4</p>
                        <p>5</p>
                        <p>6</p>
                        <p>7</p>
                        <p>8</p>
                        <p>9</p>
                        <p>10</p>
                        <p>11</p>
                        <p>12</p>
                    </div>
                </div>

                <div className="p-stats__year-tables">
                    <h2 className="p-stats__year-tables-title">合計時間（稼働日数）</h2>
                    <div className="p-stats__year-tables-box">
                        <div className="months column">
                            <p></p>
                            <p className="noto">計</p>
                            <p>1</p>
                            <p>2</p>
                            <p>3</p>
                            <p>4</p>
                            <p>5</p>
                            <p>6</p>
                            <p>7</p>
                            <p>8</p>
                            <p>9</p>
                            <p>10</p>
                            <p>11</p>
                            <p>12</p>
                        </div>
                        {clientTabelData.map(d => {
                            const projectIds = projects.filter(p => d.id === p.clientId).map(p => p.id)
                            return (
                                <div key={d.id} className="client column">
                                    <p className="noto">
                                        <span className="color" style={{ background : `${d.color}`}}></span>
                                        <span className="name">{d.name}</span>
                                        </p>
                                    <p className="total">{formatHoursMinutes(d.yearTotalSeconds)}{d.workDays === 0 ? '' : `（${d.workDays}）`}</p>
                                    {d.data.map(cd => {
                                        const period = getMonthPeriod(year,cd.date)
                                        const monthSegments = filterSegments(segments,projectIds,period)
                                        const { workDays } = summarizeSegments(monthSegments)
                                        return (
                                            <p key={cd.date}>{cd.totalSeconds === 0 ? '-' : formatHoursMinutes(cd.totalSeconds)}{workDays === 0 ? '' : `（${workDays}）`}</p>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}