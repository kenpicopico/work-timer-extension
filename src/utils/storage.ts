export const IDLE_THRESHOLD_SECONDS = 600
export const AUTO_STOP_MINUTES = 115

export type Segment = {
    id : number
    startTime : number
    endTime : number | null
    projectId : number
    status : 'working' | 'idle'
}
export const getCurrentSegment = async () => {
    const result = await chrome.storage.local.get('currentSegment')
    const loaded = (result.currentSegment ?? null) as Segment | null
    return loaded
}

export const setCurrentSegment = async ( segment : Segment | null) => {
    await chrome.storage.local.set({ 'currentSegment' : segment})
}

export const getSegments = async () => {
    const result = await chrome.storage.local.get('segments')
    const loaded = (result.segments ?? []) as Segment[] | []
    return loaded
}

export const addSegment = async ( segment : Segment) => {
    const currentSegments = await getSegments()
    const newSegments = [...currentSegments,segment]
    await chrome.storage.local.set({'segments': newSegments})
}

const splitByDay = (startTime:number, endTime:number) => {
    const parts : { startTime : number, endTime : number}[] = []
    let cursor = startTime

    while( cursor < endTime ){
        const nextMidNight = new Date(cursor)
        nextMidNight.setHours(0,0,0,0)
        nextMidNight.setDate(nextMidNight.getDate() + 1)

        const partEnd = Math.min(nextMidNight.getTime(), endTime)
        parts.push({ startTime : cursor, endTime : partEnd})
        cursor = partEnd
    }
    return parts
}

//CSのendTimeを更新して、segmentsに追加、新しいCSを保存
export const finalizeCurrentSegment = async (endTime : number, nextCurrentSegment : Segment | null) => {
    const currentSegment = await getCurrentSegment()
    if(currentSegment === null){
        await setCurrentSegment(nextCurrentSegment)
        return
    }
    if(currentSegment.status === 'working'){
        const parts = splitByDay(currentSegment.startTime, endTime)
        for(const [i, part] of parts.entries()){
            await addSegment({
                ...currentSegment,
                id : currentSegment.id + i,
                startTime : part.startTime,
                endTime : part.endTime
            })
        }
    }
    await setCurrentSegment(nextCurrentSegment)
}

export const getSessionStartTime = async () => {
    const result = await chrome.storage.local.get('sessionStartTime')
    const loaded = (result.sessionStartTime ?? null) as number | null
    return loaded
}

export const setSessionStartTime = async ( time : number | null) => {
    await chrome.storage.local.set({ 'sessionStartTime' : time })
}

//編集してsegmentsの一部を変更。※編集中に新しいsegmmentが追加される可能性についてはほぼないため考慮しない
export type SegmentError = 
    | 'START_AFTER_END' 
    | 'FUTURE' 
    | 'OVERLAP' 
    | 'OVERLAP_CURRENT' 
    | 'NOT_FOUND'
    | 'NO_FREE_SLOT'
    | 'NO_PROJECT'

export const updateSegment = async (id: number, changes: Partial<Segment>): Promise<SegmentError | null> => {
    const now = Date.now()
    const segments = await getSegments()

    const target = segments.find(s => s.id === id)

    //segmentsにそもそもない
    if(!target) return 'NOT_FOUND'
    const edited = {...target, ...changes}
    const editedEnd = edited.endTime ?? now

    //開始が終了の後
    if(edited.startTime > editedEnd) return 'START_AFTER_END'

    //未来の値を設定
    if(edited.endTime !== null && edited.endTime > now) return 'FUTURE'

    //segmentsのいずれかと重なっている
    if (segments.some(other =>
      other.id !== id &&
      edited.startTime < (other.endTime ?? now) &&
      other.startTime < editedEnd
    )) return 'OVERLAP'

    //currentSegmentと重なっている
    const current = await getCurrentSegment()
    if(current !== null){
        if(edited.startTime < now && current.startTime < editedEnd) return 'OVERLAP_CURRENT'
    } 

    //エラーがないなら上書きして更新
    const newSegments = segments.map(segment => id === segment.id ? edited : segment)
    await chrome.storage.local.set({'segments':newSegments})
    return null

}

export const deleteSegment = async (id:number) => {
    const segments = await getSegments()
    const newSegments = segments.filter(segment => segment.id !== id)
    await chrome.storage.local.set({'segments':newSegments})
}

export const findFreeSlot = (todayStartMs:number, segments:Segment[], currentSegment:Segment | null) => {
    const now = Date.now()
    const ONE_MINUTE = 60 * 1000

    // 確定済みの記録に、進行中の記録（終了は「今」）を加えて、同じ形で調べる
    const occupied = [...segments]
    if (currentSegment !== null) {
        occupied.push({ ...currentSegment, endTime: now })
    }

    let cursor = todayStartMs

    while (cursor + ONE_MINUTE <= now) {
        const overlapping = occupied.find(other =>
            cursor < (other.endTime ?? now) && other.startTime < cursor + ONE_MINUTE
        )
        if (overlapping === undefined) return cursor
        cursor = overlapping.endTime ?? now
    }
    return null
}

export const addNewSegment = async (startTime: number, projectId:number) => {
    const newSegment : Segment = { id : Date.now(), startTime : startTime, endTime : startTime + (60 * 1000), projectId : projectId, status : 'working'}
    await addSegment(newSegment)
}
