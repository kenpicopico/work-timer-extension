import React, { useState, useEffect } from "react"
import { useSelectionContext } from "../contexts/SelectionContext"
import { useTrackingContext } from "../contexts/TrackingContext"


export function useTrackingDisplay(){
    const [ showWarning, setShowWarning ] = useState<boolean>(false)
    const { projectId } = useSelectionContext()
    const { currentSegment, startTracking, stopTracking, elapsedSeconds } = useTrackingContext()

    //スタート処理
    const handleStart = (e: React.MouseEvent) => {
        e.stopPropagation()
        if(projectId === null){
            setShowWarning(true)
            return
        }
        startTracking(projectId)
    }

    //Tracking
    let statusLabel = ''
    if(currentSegment === null){
        statusLabel = 'Paused'
    } else if(currentSegment.status === 'working') {
        statusLabel = 'Tracking'
    } else {
        statusLabel = 'Idling'
    }

    let statusClass = ''
    if(currentSegment === null){
        statusClass = 'is-paused'
    } else if(currentSegment.status === 'working') {
        statusClass = 'is-tracking'
    } else {
        statusClass = 'is-idling'
    }

    let buttonLabel = ''
    let buttonIcon = ''
    let buttonAction = (_e: React.MouseEvent) => {}
    if(currentSegment === null){
        buttonLabel = 'START'
        buttonIcon = './images/icon_start.svg'
        buttonAction = handleStart
    } else {
        buttonLabel = 'Finish'
        buttonIcon = './images/icon_stop.svg'
        buttonAction = stopTracking
    }

    useEffect(() => {
        const handleClickOutside = () => {
            setShowWarning(false)
        }
        document.addEventListener('click',handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    },[])

    return {
        statusLabel,
        statusClass,
        buttonLabel,
        buttonIcon,
        buttonAction,
        showWarning,
        elapsedSeconds,
    }
}