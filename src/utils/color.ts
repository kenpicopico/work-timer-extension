export const COLOR_PALETTE = [
    { // 赤系
        client: '#FF0000',
        projects: ['#FFADAC', '#FF918E', '#FF6969', '#FF4D4D', '#FF2222', '#CE0000', '#8B0000', '#5C0000'],
    },
    { // オレンジ系
        client: '#FF7700',
        projects: ['#FFC796', '#FFB472', '#FFA353', '#FF9233', '#FF8113', '#D26200', '#AA4F00', '#753700'],
    },
    { // 黄系
        client: '#FFFF00',
        projects: ['#FFFFB0', '#FFFF7F', '#FFFF4A', '#FFFF18', '#CBCB00', '#9F9F00', '#757500', '#4E4E00'],
    },
    { // 緑系
        client: '#008000',
        projects: ['#B2FFB2', '#7FFF7F', '#43FF43', '#00FF00', '#00C600', '#009700', '#386C38', '#004800'],
    },
    { // 青系
        client: '#0000FF',
        projects: ['#D1D1FF', '#A0A0FF', '#7272FF', '#4444FF', '#2020FF', '#52C5FF', '#00AAFF', '#0070A8'],
    },
    { // ピンク系
        client: '#FF00EE',
        projects: ['#FFD6FC', '#FFB2FA', '#FF88F7', '#FF59F4', '#FF29F1', '#BC00AF', '#9A4695', '#82179F'],
    },
] as const

export const getProjectColors = (color:string) => {
    const palette = COLOR_PALETTE.find(cp => cp.client === color)
    if(palette === undefined) return undefined
    return palette.projects
}

export const findUnusedColor = (paletteProjects:readonly string[], colors:string[]) => {
    const result = paletteProjects.find(color => !colors.includes(color))
    return result
}
