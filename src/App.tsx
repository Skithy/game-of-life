import React, { useState } from 'react'

import './App.css'
import useConway from './useConway'
import useInterval from './useInterval'

const WIDTH = 40
const HEIGHT = 20

const App: React.FC = () => {
  const [started, setStarted] = useState(false)
  const [speed, setSpeed] = useState(200)
  const { grid, editCell, update, reset } = useConway(WIDTH, HEIGHT, true)

  useInterval(update, started ? speed : 0)

  const startInterval = () => {
    setStarted(true)
  }

  const endInterval = () => {
    setStarted(false)
  }

  if (!grid) {
    return <div>Loading...</div>
  }

  return (
    <div className='App'>
      {grid.map((row, y) => (
        <div className='row' key={y}>
          {row.map((cell, x) => (
            <div
              key={y * WIDTH + x}
              className='cell'
              style={{ backgroundColor: cell ? 'white' : 'black' }}
              onClick={editCell.bind(null, [x, y])}
            />
          ))}
        </div>
      ))}
      {started ? (
        <button onClick={endInterval}>STOP</button>
      ) : (
        <button onClick={startInterval}>START</button>
      )}
      <button onClick={update}>STEP</button>
      <button onClick={reset}>RESET</button>
      Speed: {speed}
      <input
        type='range'
        min='10'
        max='1000'
        value={speed}
        onChange={e => setSpeed(parseInt(e.target.value, 10))}
      />
    </div>
  )
}

export default App
