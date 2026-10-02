import { useEffect, useRef, useState } from "react"

type SelectOption = {
    id : number
    name : string
}
type SelectDropdownProps = {
    value : string | undefined
    options : SelectOption[]
    onSelect : (id : number) => void
}

export function SelectDropdown({value, options, onSelect}:SelectDropdownProps){
    const [ isOpen, setIsOpen ] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleOutside = (e:MouseEvent) => {
            if(ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown',handleOutside)
        return () => {
            document.removeEventListener('mousedown',handleOutside)
        }
    },[])

    return (
        <div ref={ref} className={`c-select__outer ${isOpen ? 'is-open' : ''}`}>
            <button type="button" className="c-select__trigger" onClick={() => setIsOpen(!isOpen)}>
                <span className="c-select__text">{value}</span>
                <span className="c-select__arrow-icon">▾</span>
            </button>
            { isOpen && (
                <ul className="c-select__options">
                    {options.map(option => (
                        <li 
                            key={option.id} 
                            className="c-select__option-item"
                            onClick={() => {
                                onSelect(option.id)
                                setIsOpen(false)
                            }}
                        >
                            {option.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}