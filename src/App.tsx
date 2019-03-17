import React, { useState } from 'react'
import classnames from 'classnames'

import './App.css'
import useConway, { rgbString, isBlack } from './useConway'
import useInterval from './useInterval'

const WIDTH = 40
const HEIGHT = 20

const App: React.FC = () => {
  const [started, setStarted] = useState(false)
  const [speed, setSpeed] = useState(150)
  const [fade, setFade] = useState(true)
  const [showGrid, setShowGrid] = useState(false)
  const { grid, editCell, update, reset } = useConway(WIDTH, HEIGHT, true)

  useInterval(update, started ? speed : 0)

  if (!grid) {
    return <div>Loading...</div>
  }

  return (
    <div className='App'>
      <div className='grid'>
        {grid.map((row, y) => (
          <div className='row' key={y}>
            {row.map((cell, x) => (
              <span
                key={y * WIDTH + x}
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

      <div className='settings'>
        {started ? (
          <button onClick={() => setStarted(false)}>STOP</button>
        ) : (
          <button onClick={() => setStarted(true)}>START</button>
        )}
        <button onClick={update}>STEP</button>
        <button onClick={reset}>RESET</button>
        Speed: {speed}
        <input
          type='range'
          min='50'
          max='550'
          step='100'
          value={speed}
          onChange={e => setSpeed(parseInt(e.target.value, 10))}
        />
        <label htmlFor='fade-chx'>Fade</label>
        <input
          id='fade-chx'
          type='checkbox'
          checked={fade}
          onChange={() => setFade(!fade)}
        />
        <label htmlFor='fade-chx'>Show grid</label>
        <input
          id='fade-chx'
          type='checkbox'
          checked={showGrid}
          onChange={() => setShowGrid(!showGrid)}
        />
      </div>
    </div>
  )
}

export default App
