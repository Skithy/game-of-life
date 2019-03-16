type Coord = [number, number]

const ctx: Worker = self as any
export default ctx

ctx.addEventListener('message', e => {
  const {
    grid,
    options: { loop },
  } = e.data

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
        .filter(o => o === 1).length

      if (status === 0) {
        // Reproduction
        if (aliveNeighbours === 3) {
          newGrid[y][x] = 1
        }
      } else {
        // Underpopulation or overpopulation
        if (aliveNeighbours < 2 || aliveNeighbours > 3) {
          newGrid[y][x] = 0
        }
      }
    }
  }

  ctx.postMessage(newGrid)
})

const clone = <T extends any>(obj: T): T => JSON.parse(JSON.stringify(obj))
