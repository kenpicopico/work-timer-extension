

// function lightenColor(hex:string,ratio:number){
//     const r = parseInt(hex.slice(1,3), 16)
//     const g = parseInt(hex.slice(3,5), 16)
//     const b = parseInt(hex.slice(5,7), 16)
//     const newR = Math.round(r + (255 - r) * ratio)
//     const newG = Math.round(g + (255 - g) * ratio)
//     const newB = Math.round(b + (255 - b) * ratio)
//     const newHex = '#' + newR.toString(16).padStart(2, '0') + newG.toString(16).padStart(2, '0') + newB.toString(16).padStart(2, '0')
//     return newHex
// }

// export function generateColorVariations(hex:string):string[]{
//     const variations : string[] = []
//     for(let i = 1; i <= 10; i++){
//         const ratio = i / 11
//         variations.push(lightenColor(hex, ratio))
//     }
//     return variations
// }
// HEXをHSLに変換するヘルパー関数
function hexToHsl(hex: string): { h: number, s: number, l: number } {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

// HSLをHEXに戻すヘルパー関数
function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// 明度や色相を調整して10段階のバリエーションを作る関数
export function generateColorVariations(hex: string): string[] {
    const { h, s } = hexToHsl(hex);
    const variations: string[] = [];

    // 例：明度（Lightness）を 30% 〜 75% の見やすい範囲で10分割する
    // （これなら真っ白にならず、かつ潰れないハッキリした色になります）
    for (let i = 0; i < 10; i++) {
        // 30%（やや暗め）から 75%（やや明るめ）の間で変化させる
        const minL = 30;
        const maxL = 75;
        const newL = minL + (maxL - minL) * (i / 9);
        
        // オプション：少しだけ色相（Hue）をズラしたい場合はここで h をいじれます
        // const newH = (h + i * 3) % 360; 

        variations.push(hslToHex(h, s, newL));
    }

    return variations;
}