import { IDLE_THRESHOLD_SECONDS, AUTO_STOP_MINUTES, getCurrentSegment, finalizeCurrentSegment, type Segment, setSessionStartTime, setCurrentSegment } from "./utils/storage";


function openCustomWindow() {
    chrome.windows.create({
      url: "index.html",
      type: "popup",
      width: 400,
      height: 180
    });
}

chrome.runtime.onInstalled.addListener(() => {
    openCustomWindow();
    chrome.idle.setDetectionInterval(IDLE_THRESHOLD_SECONDS)
});

chrome.action.onClicked.addListener(() => {
    openCustomWindow();
});


//操作の有無で送られるidleやactiveのステータスに合わせて、nextCurrentSegmentを作成し、CurrentSegmmentのendTimeを作成し、finalizeCurrentSegmentに渡す。
chrome.idle.onStateChanged.addListener(async (newState) => {
    if(newState === 'idle'){
        console.log('idle')
        const currentSegment = await getCurrentSegment()
        if(currentSegment === null){
            return
        }
        let boundaryTime = Date.now() - (IDLE_THRESHOLD_SECONDS * 1000)
        if(boundaryTime < currentSegment.startTime){
            boundaryTime = currentSegment.startTime
        }
        const nextCurrentSegment : Segment = {
            id : Date.now(),
            startTime : boundaryTime,
            endTime : null,
            projectId : currentSegment.projectId,
            status : 'idle'
        }
        await finalizeCurrentSegment(boundaryTime,nextCurrentSegment)
        chrome.alarms.create('autoStopTracking', { delayInMinutes: AUTO_STOP_MINUTES })

    } else if(newState === 'active'){
        const currentSegment = await getCurrentSegment()
        if(currentSegment === null){
            return
        }
        const nextCurrentSegment : Segment = {
            id : Date.now(),
            startTime : Date.now(),
            endTime : null,
            projectId : currentSegment.projectId,
            status : 'working'
        }
        await finalizeCurrentSegment(Date.now(),nextCurrentSegment)
        chrome.alarms.clear('autoStopTracking')
    }
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if(alarm.name === 'autoStopTracking'){
        await finalizeCurrentSegment(Date.now(),null)
        await setSessionStartTime(null)
    }
})

chrome.runtime.onMessage.addListener(async (message) => {
    if(message.type === 'STOP_TRACKING'){
        await finalizeCurrentSegment(Date.now(),null)
        await setSessionStartTime(null)
    } else if(message.type === 'SET_ACTIVE_PROJECT'){
        const currentSegment = await getCurrentSegment()
        const newSegment : Segment = {
            id : Date.now(),
            startTime : Date.now(),
            endTime : null,
            projectId : message.projectId,
            status : 'working'
        }
        if(currentSegment === null){
            await setCurrentSegment(newSegment)
            await setSessionStartTime(Date.now())
        } else {
            await finalizeCurrentSegment(Date.now(),newSegment)
        }
    }
})



