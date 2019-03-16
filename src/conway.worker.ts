import produce from 'immer'

type Coord = [number, number]

const ctx: Worker = self as any
export default ctx

let grid: number[][] = [[0]]
let width = 0
let height = 0
let loop = false
let changedSet = new Set<number>()
let interval: NodeJS.Timeout

ctx.addEventListener('message', e => {
  switch (e.data.type) {
    case 'init': {
      const options = e.data.payload
      width = options.width
      height = options.height
      loop = options.loop
      grid = init2DGrid(width, height)
      broadcastGrid()
      return
    }

    case 'editCell': {
      const [x, y] = e.data.payload
      grid = produce(grid, draft => {
        draft[y][x] = draft[y][x] ? 0 : 1
      })

      setChanged([x, y], changedSet)
      broadcastGrid()
      return
    }

    case 'update': {
      update()
      return
    }

    case 'reset': {
      grid = init2DGrid(width, height)
      changedSet = new Set()
      broadcastGrid()
      return
    }

    case 'startInterval': {
      const speed = e.data.payload
      interval = setInterval(update, speed)
      return
    }

    case 'stopInterval': {
      clearInterval(interval)
      return
    }
  }
})

const broadcastGrid = () => {
  ctx.postMessage(grid)
}

const init2DGrid = (width: number, height: number) =>
  [...Array(height)].map(() => Array(width).fill(0))

const setChanged = (coord: Coord, set: Set<number>) => {
  set.add(getValue(coord))
  getNeighbours(coord).forEach(c => {
    set.add(getValue(c))
  })
}

const update = () => {
  const newChanged = new Set<number>()
  const newGrid = produce(grid, draft => {
    changedSet.forEach(value => {
      const coord = getCoord(value)
      const [x, y] = coord
      const status = grid[y][x]

      const aliveNeighbours = getNeighbours(coord)
        .map(([nX, nY]) => grid[nY][nX])
        .filter(o => o === 1).length

      if (status === 0) {
        // Reproduction
        if (aliveNeighbours === 3) {
          draft[y][x] = 1
          setChanged(coord, newChanged)
        }
      } else {
        // Underpopulation or overpopulation
        if (aliveNeighbours < 2 || aliveNeighbours > 3) {
          draft[y][x] = 0
          setChanged(coord, newChanged)
        }
      }
    })
  })

  grid = newGrid
  changedSet = newChanged
  broadcastGrid()
}

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

const getValue = ([x, y]: Coord): number => y * width + x
const getCoord = (value: number): Coord => [
  value % width,
  Math.trunc(value / width),
]

// const clone = <T extends any>(obj: T): T => JSON.parse(JSON.stringify(obj))
