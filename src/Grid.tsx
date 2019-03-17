import React, { HTMLProps, memo } from 'react'
import classnames from 'classnames'

import { RGBGrid, Coord } from './useConway'
import { isBlack, rgbString } from './colours'

interface IProps extends HTMLProps<HTMLDivElement> {
  grid: RGBGrid
  fade: boolean
  showGrid: boolean
  editCell(coord: Coord): void
}

const Grid: React.FC<IProps> = props => {
  const { grid, fade, showGrid, editCell, ...containerProps } = props
  const width = grid[0].length

  return (
    <div {...containerProps}>
      {grid.map((row, y) => (
        <div className='row' key={y}>
          {row.map((cell, x) => (
            <span
              key={y * width + x}
              className={classnames('cell', {
                fade: fade && isBlack(cell),
                border: showGrid,
              })}
              style={{ backgroundColor: rgbString(cell) }}
              onClick={() => editCell([x, y])}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default memo(Grid)
