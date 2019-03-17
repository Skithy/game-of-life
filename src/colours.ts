export type RGB = [number, number, number]

export const black: RGB = [0, 0, 0]
export const white: RGB = [255, 255, 255]
export const red: RGB = [255, 0, 0]
export const yellow: RGB = [255, 255, 0]
export const green: RGB = [0, 255, 0]
export const cyan: RGB = [0, 255, 255]
export const blue: RGB = [0, 0, 255]
export const purple: RGB = [255, 0, 255]

export const colours = [white, red, yellow, green, cyan, blue, purple]

export const isEq = (c1: RGB, c2: RGB) => {
  return c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2]
}
export const isBlack = (colour: RGB) => {
  return isEq(colour, black)
}

export const rgbString = ([r, g, b]: RGB) => `rgb(${r}, ${g}, ${b})`

export const avgColour = (colours: RGB[]): RGB => {
  const avg = (numbers: number[]) =>
    numbers.reduce((a, b) => a + b) / numbers.length

  return [
    avg(colours.map(c => c[0])),
    avg(colours.map(c => c[1])),
    avg(colours.map(c => c[2])),
  ]
}
