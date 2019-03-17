import { useState, useRef, useEffect } from 'react'
import produce from 'immer'

import ConwayWorker from 'worker-loader!./conway.worker'

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
export const white: RGB = [255, 255, 255]
export const red: RGB = [255, 0, 0]
export const yellow: RGB = [255, 255, 0]
export const green: RGB = [0, 255, 0]
export const cyan: RGB = [0, 255, 255]
export const blue: RGB = [0, 0, 255]
export const purple: RGB = [255, 0, 255]

const colours = [white, red, yellow, green, cyan, blue, purple]

export const isEq = (c1: RGB, c2: RGB) => {
  return c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2]
}
export const isBlack = (colour: RGB) => {
  return isEq(colour, black)
}

export const rgbString = ([r, g, b]: RGB, a?: number) =>
  a ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`

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

const useConway = (width: number, height: number, loop: boolean) => {
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

  const editCell = (coord: Coord) => {
    setGrid(currentGrid => {
      return produce(currentGrid, draft => {
        const [x, y] = coord
        const randNum = Math.floor(Math.random() * colours.length)
        const randColour = colours[randNum]
        draft[y][x] = isBlack(grid[y][x]) ? randColour : black
      })
    })
  }

  const update = () => {
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
