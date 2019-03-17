import { Coord } from './useConway'

export interface IStamp {
  name: string
  height: number
  width: number
  pattern: string
}

export const stampToCoords = (stamp: IStamp): Coord[] => {
  const pattern = stamp.pattern
  const lines = pattern
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length === stamp.width)

  const coords: Coord[] = []

  lines.forEach((line, y) => {
    line.split('').forEach((value, x) => {
      if (value === 'o') {
        coords.push([x, y])
      }
    })
  })
  return coords
}

export const stamps: IStamp[] = [
  {
    name: 'Single',
    height: 1,
    width: 1,
    pattern: `
      o
    `,
  },
  {
    name: 'Glider',
    height: 3,
    width: 3,
    pattern: `
      .o.
      ..o
      ooo
    `,
  },
  {
    name: 'R-pentomino',
    height: 3,
    width: 3,
    pattern: `
      .oo
      oo.
      .o.
    `,
  },
  {
    name: 'White Bear',
    height: 3,
    width: 3,
    pattern: `
      .o.
      ooo
      o.o
    `,
  },
  {
    name: 'Pulsar',
    height: 13,
    width: 13,
    pattern: `
      ..ooo...ooo..
      .............
      o....o.o....o
      o....o.o....o
      o....o.o....o
      ..ooo...ooo..
      .............
      ..ooo...ooo..
      o....o.o....o
      o....o.o....o
      o....o.o....o
      .............
      ..ooo...ooo..
    `,
  },
]
