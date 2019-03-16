import { useState } from 'react'
import produce from 'immer'

type Coord = [number, number]

const init2DGrid = (width: number, height: number) =>
  [...Array(height)].map(() => Array(width).fill(0))

const useConway = (width: number, height: number, loop: boolean) => {
  const [grid, setGrid] = useState<number[][]>(init2DGrid(width, height))
  const [changedSet, setChangedSet] = useState(new Set<number>())

  const setChanged = (coord: Coord, set: Set<number>) => {
    set.add(getValue(coord))
    getNeighbours(coord).forEach(c => {
      set.add(getValue(c))
    })
    return set
  }

  const editCell = (coord: Coord) => {
    const newGrid = produce(grid, draft => {
      const [x, y] = coord
      draft[y][x] = grid[y][x] === 1 ? 0 : 1
    })

    setGrid(newGrid)
    setChangedSet(setChanged(coord, new Set(changedSet)))
  }

  const update = () => {
    const newChanged = new Set<number>()
    const existingGrid = [...grid]
    const changeSet = new Set(changedSet)
    const newGrid = produce(existingGrid, draft => {
      changeSet.forEach(value => {
        const coord = getCoord(value)
        const [x, y] = coord
        const status = existingGrid[y][x]

        const aliveNeighbours = getNeighbours(coord)
          .map(([nX, nY]) => existingGrid[nY][nX])
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

    setGrid(newGrid)
    setChangedSet(newChanged)
  }

  const reset = () => {
    setGrid(init2DGrid(width, height))
    setChangedSet(new Set())
  }

  /* Helpers */
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

  return {
    grid,
    editCell,
    reset,
    update,
  }
}

export default useConway
