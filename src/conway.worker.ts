import { RGB, avgColour, isEq, black } from './colours'

const ctx: Worker = self as any
export default ctx

type Coord = [number, number]
type RGBGrid = RGB[][]
interface UpdatePayload {
  grid: RGBGrid
  options: {
    loop: boolean
  }
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
          // get avg of all neighbours
          // newGrid[y][x] = avgColour(aliveNeighbours)

          // get 2 random neighours and av colour
          const parents = aliveNeighbours
            .sort(() => 0.5 - Math.random()) // Shuffle array
            .slice(0, 2)
          newGrid[y][x] = avgColour(parents)
          // choose colour of random neighbour
          // const randomIndex = Math.floor(Math.random() * avgColour.length)
          // newGrid[y][x] = aliveNeighbours[randomIndex]
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
