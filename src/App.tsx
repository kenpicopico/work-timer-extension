import { useState } from 'react'
import { SmallWindow } from './components/SmallWindow/SmallWindow'
import { LargeWindow } from './components/LargeWindow/LargeWindow'

function App() {
  const [isExpand, setIsExpand] = useState<boolean>(false)

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

  return (
    <>
    {!isExpand ? <SmallWindow onExpand={handleExpand} /> : <LargeWindow onShrink={handleShrink} />}
    
    </>
  )
}

export default App
