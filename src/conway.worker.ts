const ctx: Worker = self as any
export default ctx

export type Coord = [number, number]
export type RGB = [number, number, number]
export type RGBGrid = RGB[][]
export interface UpdatePayload {
  grid: RGBGrid
  options: {
    loop: boolean
  }
}

export const black: RGB = [0, 0, 0]
export const isEq = (c1: RGB, c2: RGB) => [0, 1, 2].every(x => c1[x] === c2[x])
export const avgColour = (colours: RGB[]): RGB => {
  const avg = (numbers: number[]) =>
    numbers.reduce((a, b) => a + b) / numbers.length

  return [
    avg(colours.map(c => c[0])),
    avg(colours.map(c => c[1])),
    avg(colours.map(c => c[2])),
  ]
}

ctx.addEventListener('message', e => {
  const {
    grid,
    options: { loop },
  } = e.data as UpdatePayload

  const width = grid[0].length
  const height = grid.length
  const newGrid = clone(grid)

  const getNeighbours = ([x, y]: Coord): Coord[] => {
    const neighbours: Coord[] = []
    for (let j = -1; j < 2; j++) {
      for (let i = -1; i < 2; i++) {
        let newX = x + i
        let newY = y + j

        if (loop) {
          if (newX < 0) newX = width - 1
          if (newX >= width) newX = 0
          if (newY < 0) newY = height - 1
          if (newY >= height) newY = 0
        }

        if (i === 0 && j === 0) continue
        if (newX < 0 || newX >= width) continue
        if (newY < 0 || newY >= height) continue
        neighbours.push([newX, newY])
      }
    }

    return neighbours
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const status = grid[y][x]

      const aliveNeighbours = getNeighbours([x, y])
        .map(([nX, nY]) => grid[nY][nX])
        .filter(o => !isEq(o, black))

      if (isEq(status, black)) {
        // Reproduction
        if (aliveNeighbours.length === 3) {
          newGrid[y][x] = avgColour(aliveNeighbours)
        }
      } else {
        // Underpopulation or overpopulation
        if (aliveNeighbours.length < 2 || aliveNeighbours.length > 3) {
          newGrid[y][x] = black
        }
      }
    }
  }

  ctx.postMessage(newGrid)
})

const clone = <T extends any>(obj: T): T => JSON.parse(JSON.stringify(obj))
