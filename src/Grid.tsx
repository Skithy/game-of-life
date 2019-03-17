import React, { HTMLProps, memo, CSSProperties } from 'react'
import classnames from 'classnames'

import { RGBGrid, Coord } from './useConway'
import { isBlack, rgbString, RGB, isEq, black } from './colours'

interface IProps extends HTMLProps<HTMLDivElement> {
  grid: RGBGrid
  fade: boolean
  showGrid: boolean
  selectedCells: Coord[]
  selectedColour: RGB
  editCell(coord: Coord): void
  handleCellHover(coord: Coord): void
  handleCellLeave(): void
}

const Grid: React.FC<IProps> = props => {
  const {
    grid,
    fade,
    showGrid,
    selectedCells,
    selectedColour,
    editCell,
    handleCellHover,
    handleCellLeave,
    ...containerProps
  } = props
  const width = grid[0].length

  return (
    <div {...containerProps}>
      {grid.map((row, y) => (
        <div className='row' key={y}>
          {row.map((cell, x) => {
            const className = classnames('cell', {
              fade: fade && isBlack(cell),
              border: showGrid,
            })

            const isHovered = props.selectedCells.some(
              ([nX, nY]) => nX === x && nY === y
            )

            const hoverColour = isEq(cell, selectedColour)
              ? black
              : selectedColour

            const additionalStyle: CSSProperties = {
              backgroundColor: rgbString(cell),
              border: isHovered
                ? `1px solid ${rgbString(hoverColour)}`
                : undefined,
            }

            return (
              <span
                key={y * width + x}
                className={className}
                style={additionalStyle}
                onClick={() => editCell([x, y])}
                onMouseEnter={() => handleCellHover([x, y])}
                onMouseLeave={handleCellLeave}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default memo(Grid)
