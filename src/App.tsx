import React, { useState, useEffect, useRef } from 'react'

import ConwayWorker from 'worker-loader!./conway.worker'
import './App.css'

const WIDTH = 40
const HEIGHT = 20

const App: React.FC = () => {
  const [started, setStarted] = useState(false)
  const [speed, setSpeed] = useState(200)
  const [grid, setGrid] = useState<number[][]>()
  const conwayWorker = useRef(new ConwayWorker())

  useEffect(() => {
    conwayWorker.current.postMessage({
      type: 'init',
      payload: {
        width: WIDTH,
        height: HEIGHT,
        loop: true,
      },
    })

    conwayWorker.current.addEventListener('message', ev => {
      setGrid(ev.data)
    })

    return () => {
      conwayWorker.current.terminate()
    }
  }, [])

  const editCell = (x: number, y: number) => {
    conwayWorker.current.postMessage({
      type: 'editCell',
      payload: [x, y],
    })
  }

  const update = () => {
    conwayWorker.current.postMessage({ type: 'update' })
  }

  const reset = () => {
    conwayWorker.current.postMessage({ type: 'reset' })
  }

  const startInterval = () => {
    setStarted(true)
    conwayWorker.current.postMessage({ type: 'startInterval', payload: speed })
  }

  const endInterval = () => {
    setStarted(false)
    conwayWorker.current.postMessage({ type: 'stopInterval' })
  }

  const changeIntervalSpeed = (newSpeed: number) => {
    setSpeed(newSpeed)
    conwayWorker.current.postMessage({
      type: 'changeIntervalSpeed',
      payload: newSpeed,
    })
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
              onClick={editCell.bind(null, x, y)}
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
        min='50'
        max='1000'
        value={speed}
        onChange={e => changeIntervalSpeed(parseInt(e.target.value, 10))}
      />
    </div>
  )
}

export default App
