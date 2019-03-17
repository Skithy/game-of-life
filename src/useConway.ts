import { useState, useRef, useEffect } from 'react'
import produce from 'immer'

import ConwayWorker from 'worker-loader!./conway.worker'
import { RGB, black, isEq } from './colours'

export type Coord = [number, number]
export type RGBGrid = RGB[][]
export interface UpdatePayload {
  grid: RGBGrid
  options: {
    loop: boolean
  }
}

const init2DGrid = (width: number, height: number) => {
  const arr: RGBGrid = []
  for (let y = 0; y < height; y++) {
    const row = []
    for (let x = 0; x < width; x++) {
      row.push(black)
    }
    arr.push(row)
  }
  return arr
}

const useConway = (width: number, height: number) => {
  const [grid, setGrid] = useState<RGBGrid>(init2DGrid(width, height))
  const conwayWorker = useRef<Worker>()

  useEffect(() => {
    conwayWorker.current = new ConwayWorker()
    conwayWorker.current.addEventListener('message', ev => {
      setGrid(ev.data)
    })

    return () => {
      if (conwayWorker.current) {
        conwayWorker.current.terminate()
      }
    }
  }, [])

  const editCell = (colour: RGB, coord: Coord) => {
    setGrid(currentGrid => {
      return produce(currentGrid, draft => {
        const [x, y] = coord
        draft[y][x] = isEq(grid[y][x], colour) ? black : colour
      })
    })
  }

  const update = (loop: boolean) => {
    if (conwayWorker.current) {
      const payload: UpdatePayload = {
        grid,
        options: { loop },
      }
      conwayWorker.current.postMessage(payload)
    }
  }

  const reset = () => {
    setGrid(init2DGrid(width, height))
  }

  return {
    grid,
    editCell,
    reset,
    update,
  }
}

export default useConway
