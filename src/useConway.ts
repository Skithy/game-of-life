import { useState, useRef, useEffect } from 'react'
import produce from 'immer'

import ConwayWorker from 'worker-loader!./conway.worker'

type Coord = [number, number]

const init2DGrid = (width: number, height: number) =>
  [...Array(height)].map(() => Array(width).fill(0))

const useConway = (width: number, height: number, loop: boolean) => {
  const [grid, setGrid] = useState<number[][]>(init2DGrid(width, height))
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

  const editCell = (coord: Coord) => {
    const newGrid = produce(grid, draft => {
      const [x, y] = coord
      draft[y][x] = grid[y][x] === 1 ? 0 : 1
    })

    setGrid(newGrid)
  }

  const update = () => {
    if (conwayWorker.current) {
      conwayWorker.current.postMessage({ grid, options: { loop } })
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
