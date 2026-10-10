import { type FinishedSegment } from "../utils/storage";
import { useProjectContext } from "../contexts/ProjectContext";
import { useClientContext } from "../contexts/ClientContext";

export type ClientBreakdown = {
    clientId: number
    clientColor: string
    totalSeconds: number
    projects: {
        projectId: number
        projectColor: string
        totalSeconds: number
    }[]
}
export function useClientBreakdown(segments:FinishedSegment[]) : { clientBreakdown: ClientBreakdown[] }{
    const { projects } = useProjectContext()
    const { clients } = useClientContext()

    const projectBreakdown = projects.map((project) => {
        const projectSegments = segments.filter(segment => segment.projectId === project.id)
        let totalSeconds = 0
        for(let i = 0; i< projectSegments.length; i++){
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

    const clientBreakdown = clients.map(client => {
        const clientProjects = projectBreakdown
            .filter(pb => pb.clientId === client.id && pb.totalSeconds > 0)
            .map(pb =>({
                projectId : pb.projectId,
                projectColor : pb.projectColor,
                totalSeconds : pb.totalSeconds
            }))
        const totalSeconds = clientProjects.reduce((sum,cp) => sum + cp.totalSeconds ,0)
        return {
            clientId : client.id,
            clientColor : client.color,
            totalSeconds,
            projects : clientProjects
        }
    }).filter(cb => cb.totalSeconds > 0)

    return {
        clientBreakdown
    }
}