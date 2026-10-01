import { useEffect, useRef, useState } from "react"

type TimeDropdownProps = {
    value : number | null
    options : number[]
    onSelect : (n:number) => void
}

export function TimeDropdown({value,options,onSelect}:TimeDropdownProps){
    const [ isOpen, setIsOpen ] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleOutside = (e:MouseEvent) => {
            if(ref.current && !ref.current.contains(e.target as Node)){
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown',handleOutside)
        return () => {
            document.removeEventListener('mousedown',handleOutside)
        }
    },[])
    return (
        <div ref={ref} className='box'>
            <button 
                type='button' 
                onClick={() => setIsOpen(!isOpen)}
            >
                { value === null ? '--' : String(value).padStart(2,'0')}
            </button>
            {isOpen && (
                <ul className='selects'>
                    { options.map(n => (
                        <li key={n} onClick={() => {
                            onSelect(n)
                            setIsOpen(false)
                        }}>
                            {String(n).padStart(2,'0')}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}