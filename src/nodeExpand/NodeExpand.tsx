import React from 'react'

const NodeExpand = (props: Props) => {
  const x1 = 10
  const y1 = 100

  const x2 = 150
  const y2 = 10

  const x3 = 230
  const y3 = 70

  const width = 60
  const height = 40

  return (
    <div style={{ position: 'relative' }}>
      <svg style={{ position: 'absolute' }}>
        <path
          d={getPath({ x1: x1 + width, y1: y1 + height / 2, x2, y2: y2 + height / 2 })}
          stroke="black"
          fill="transparent"
        />

        <path
          d={getPath({ x1: x1 + width, y1: y1 + height / 2, x2: x3, y2: y3 + height / 2 })}
          stroke="black"
          fill="transparent"
        />
      </svg>
      <MyNode x={x1} y={y1} width={width} height={height} label="test 1" />
      <MyNode x={x2} y={y2} width={width} height={height} label="test 2" />
      <MyNode x={x3} y={y3} width={width} height={height} label="test 3" />
    </div>
  )
}

const MyNode = ({ x, y, width = 60, height = 40, label = 'myNode' }: INode) => (
  <div
    style={{
      position: 'absolute',
      top: y,
      left: x,
      width,
      height,
      border: '1px solid magenta',
    }}
  >
    {label}
  </div>
)

const getPath = ({ x2, x1, y2, y1 }: P): string => {
  const cx = x2 - x1 / 2
  const path = `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`

  return path
}

interface INode {
  x: number
  y: number
  width: number
  height: number
  label: string
}

interface P {
  x1: number
  y1: number
  x2: number
  y2: number
}

export default NodeExpand

export interface Props {}
