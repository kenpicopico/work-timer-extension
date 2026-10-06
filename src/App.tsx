import { useState, useEffect } from 'react'
import { SmallWindow } from './components/SmallWindow/SmallWindow'
import { LargeWindow } from './components/LargeWindow/LargeWindow'

function App() {
  const [isExpand, setIsExpand] = useState<boolean | null>(null)

  useEffect(() => {
    const checkWindowSize = async () => {
      const currentWindow = await chrome.windows.getCurrent()

      if (currentWindow.width !== undefined && currentWindow.height !== undefined) {
        setIsExpand(
          currentWindow.width >= 1000 && currentWindow.height >= 800
        )
      }
    }

    checkWindowSize()
  }, [])

  const handleExpand = async () => {
    const currentWindow = await chrome.windows.getCurrent();
    if(currentWindow.id !== undefined){
      await chrome.windows.update(currentWindow.id, {
        width : 1000,
        height : 800
      });
      setIsExpand(true)
    }
  }

  const handleShrink = async () => {
    const currentWindow = await chrome.windows.getCurrent();
    if(currentWindow.id !== undefined){
      await chrome.windows.update(currentWindow.id, {
        width : 400,
        height : 180
      });
      setIsExpand(false)
    }
  }

  if (isExpand === null) {
    return null
  }

  return (
    <>
    {!isExpand ? <SmallWindow onExpand={handleExpand} /> : <LargeWindow onShrink={handleShrink} />}
    
    </>
  )
}

export default App
