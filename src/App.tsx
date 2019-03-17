import React, { useState } from 'react'
import classnames from 'classnames'

import './App.css'
import useConway, { Coord } from './useConway'
import useInterval from './useInterval'
import Grid from './Grid'
import { colours, rgbString, RGB, white, isEq } from './colours'
import { IStamp, stamps, stampToCoords } from './stamps'

const WIDTH = 40
const HEIGHT = 22

const App: React.FC = () => {
  const [started, setStarted] = useState(false)
  const [speed, setSpeed] = useState(150)
  const [fade, setFade] = useState(true)
  const [showGrid, setShowGrid] = useState(false)
  const [loop, setLoop] = useState(true)
  const [selectedColour, setSelectedColour] = useState<RGB>(white)
  const [selectedCells, setSelectedCells] = useState<Coord[]>([])
  const [selectedStamp, setSelectedStamp] = useState<IStamp>(stamps[0])
  const { grid, editCell, update, reset } = useConway(WIDTH, HEIGHT)

  useInterval(
    () => {
      update(loop)
    },
    started ? speed : 0
  )

  if (!grid) {
    return <div>Loading...</div>
  }

  const handleCellHover = ([x, y]: Coord) => {
    const newSelectedCells = stampToCoords(selectedStamp).map(([nX, nY]) => {
      let newX = x + nX
      let newY = y + nY

      if (loop) {
        if (newX < 0) newX += WIDTH
        if (newX >= WIDTH) newX -= WIDTH
        if (newY < 0) newY += HEIGHT
        if (newY >= HEIGHT) newY -= HEIGHT
      }

      return [newX, newY] as Coord
    })
    setSelectedCells(newSelectedCells)
  }

  const handleCellLeave = () => {
    setSelectedCells([])
  }

  return (
    <main className='App'>
      <Grid
        className='grid'
        grid={grid}
        fade={fade}
        showGrid={showGrid}
        selectedCells={selectedCells}
        selectedColour={selectedColour}
        editCell={() => editCell(selectedColour, selectedCells)}
        handleCellHover={handleCellHover}
        handleCellLeave={handleCellLeave}
      />

      <div className='settings'>
        <section className='settings-row'>
          <StartButton started={started} setStarted={setStarted} />
          <button
            className='pure-button button-secondary'
            onClick={() => update(loop)}
          >
            STEP
          </button>
          <button className='pure-button button-warning' onClick={reset}>
            RESET
          </button>
        </section>
        <section className='settings-row'>
          <label id='speed-slider-label' htmlFor='speed-slider'>
            Speed: {speed}ms
          </label>
          <input
            id='speed-slider'
            type='range'
            min='50'
            max='550'
            step='100'
            value={speed}
            onChange={e => setSpeed(parseInt(e.target.value, 10))}
          />
        </section>
        <section className='settings-row'>
          <label className='pure-checkbox'>
            <input
              id='loop-chx'
              type='checkbox'
              checked={loop}
              onChange={() => setLoop(!loop)}
            />
            Loop
          </label>
        </section>
        <section className='settings-row'>
          <label className='pure-checkbox'>
            <input
              id='fade-chx'
              type='checkbox'
              checked={fade}
              onChange={() => setFade(!fade)}
            />
            Fade-out
          </label>
        </section>
        <section className='settings-row'>
          <label className='pure-checkbox'>
            <input
              id='show-grid-chx'
              type='checkbox'
              checked={showGrid}
              onChange={() => setShowGrid(!showGrid)}
            />
            Show grid
          </label>
        </section>
        <section className='settings-row'>
          <label className='select-label'>Colour select</label>
          <div className='colour-select'>
            {colours.map(c => (
              <span
                key={c.toString()}
                className={classnames('cell-select', {
                  'cell-selected': isEq(selectedColour, c),
                })}
                style={{ backgroundColor: rgbString(c) }}
                onClick={() => setSelectedColour(c)}
              />
            ))}
          </div>
        </section>
        <section className='settings-row'>
          <label className='select-label'>Stamp select</label>
          <div className='colour-select'>
            {stamps.map(s => (
              <button
                key={s.name}
                className={classnames('pure-button', {
                  'button-secondary': s === selectedStamp,
                  'pure-button-active': s === selectedStamp,
                })}
                onClick={() => setSelectedStamp(s)}
              >
                {s.name}
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

const StartButton: React.FC<{
  started: boolean
  setStarted: (started: boolean) => void
}> = props => {
  if (props.started) {
    return (
      <button
        className='pure-button pure-button-active button-error'
        id='stop-button'
        onClick={() => props.setStarted(false)}
      >
        STOP
      </button>
    )
  }

  return (
    <button
      className='pure-button button-success'
      id='start-button'
      onClick={() => props.setStarted(true)}
    >
      START
    </button>
  )
}

export default App
