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

//CSのendTimeを更新して、segmentsに追加、新しいCSを保存
export const finalizeCurrentSegment = async (endTime : number, nextCurrentSegment : Segment | null) => {
    const currentSegment = await getCurrentSegment()
    if(currentSegment === null){
        await setCurrentSegment(nextCurrentSegment)
        return
    }
    const additionalSegment = {...currentSegment, endTime : endTime }
    if(additionalSegment.status === 'working'){
        await addSegment(additionalSegment)
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

    const newSegments = segments.map(segment => id === segment.id ? edited : segment)
    await chrome.storage.local.set({'segments':newSegments})
    return null

}

export const deleteSegment = async (id:number) => {
    const segments = await getSegments()
    const newSegments = segments.filter(segment => segment.id !== id)
    await chrome.storage.local.set({'segments':newSegments})
}

