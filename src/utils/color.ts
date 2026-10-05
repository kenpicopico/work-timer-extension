export const COLOR_PALETTE = [
    { // 赤系
        client: '#FF0000',
        projects: ['#FF0000', '#FF4D4D', '#FF8080', '#CC0000', '#FF6666', '#990000', '#FFB3B3', '#E60000'],
    },
    { // 黄系
        client: '#FBFF00',
        projects: ['#FBFF00', '#FDFF66', '#FEFF99', '#C9CC00', '#FCFF4D', '#999B00', '#FEFFCC', '#E3E600'],
    },
    { // 緑系
        client: '#0DFF00',
        projects: ['#0DFF00', '#5CFF52', '#99FF93', '#0AC700', '#3DFF33', '#078000', '#CCFFC9', '#0BE600'],
    },
    { // 青系
        client: '#005DFF',
        projects: ['#005DFF', '#4D93FF', '#80B0FF', '#0046C7', '#3378FF', '#003399', '#B3D0FF', '#0052E6'],
    },
    { // 紫系
        client: '#AA00FF',
        projects: ['#AA00FF', '#C44DFF', '#D580FF', '#8800CC', '#BB33FF', '#660099', '#E6B3FF', '#9900E6'],
    },
    { // ピンク系
        client: '#FF00EE',
        projects: ['#FF00EE', '#FF4DF3', '#FF80F6', '#CC00BE', '#FF33F1', '#990090', '#FFB3FA', '#E600D6'],
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
