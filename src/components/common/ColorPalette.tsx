export type ColorPaletteProps = {
    palette : readonly string[] | undefined
    color : string
    otherColors : string[]
    onSelect : (color : string) => void
}

export function ColorPalette({palette, color, otherColors, onSelect}:ColorPaletteProps){

    return (
        <div className='palette js-palette'>
            {palette?.map(cp => (
                <button
                    key={cp}
                    type='button'
                    style={{ background : cp}}
                    className={`color ${color === cp ? 'is-current' : ''} ${otherColors.includes(cp) ? 'is-used' : ''}`}
                    onClick={() => onSelect(cp)}
                    disabled={color === cp || otherColors.includes(cp)}
                ></button>
            ))}
        </div>
    )
}