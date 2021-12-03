import React, { CSSProperties, useState } from 'react'

const x1 = 10
const y1 = 100

const x2 = 150
const y2 = 10

const x3 = 230
const y3 = 70

const x4 = 500
const y4 = 300

const x5 = 400
const y5 = 440

const x6 = 280
const y6 = 330

const NodeExpand = (props: Props) => {
  const subGr = [
    {
      x: x4,
      y: y4,
      label: 'test 4',
    },
    {
      x: x5,
      y: y5,
      label: 'test 5',
    },
    {
      x: x6,
      y: y6,
      label: 'test 6',
    },
  ]

  const [isOpen, setIsOpen] = useState(true)
  const toggle = () => setIsOpen(isOpen => !isOpen)

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <path d={getPath(handleCoords(x1, y1, x2, y2))} stroke="black" fill="transparent" />
        <path d={getPath(handleCoords(x1, y1, x3, y3))} stroke="black" fill="transparent" />
        <path d={getPath(handleCoords(x3, y3, x4, y4))} stroke="black" fill="transparent" />
        <path d={getPath(handleCoords(x5, y5, x4, y4))} stroke="black" fill="transparent" />
        <path d={getPath(handleCoords(x6, y6, x4, y4))} stroke="black" fill="transparent" />
        <path d={getPath(handleCoords(x3, y3, x5, y5))} stroke="black" fill="transparent" />
      </svg>
      <MyNode x={x1} y={y1} label="test 1" />
      <MyNode x={x2} y={y2} label="test 2" />
      <MyNode x={x3} y={y3} label="test 3" />

      <Subgraph nodes={subGr} isOpen={isOpen} onToggle={toggle} />
    </div>
  )
}

const nodeWidth = 60
const nodeHeight = 40

const handleCoords = (x1: number, y1: number, x2: number, y2: number) => ({
  x1: x1 + nodeWidth,
  y1: y1 + nodeHeight / 2,
  x2,
  y2: y2 + nodeHeight / 2,
})

const Subgraph = ({ nodes, isOpen, onToggle }: ISubgraph) => {
  const nodes2 = isOpen ? nodes : [nodes[0]]

  return (
    <>
      <SubgraphBox nodes={nodes2} isOpen={isOpen} onToggle={onToggle} />
      {nodes2.map(node => (
        <MyNode x={node.x} y={node.y} label={node.label} />
      ))}
    </>
  )
}

interface ISubgraph extends ISubgraphBox {
  isOpen: boolean
  onToggle: () => void
}

const SubgraphBox = ({ nodes, isOpen, onToggle }: ISubgraph) => {
  const xs = nodes.map((n: INode) => n.x)
  const ys = nodes.map((n: INode) => n.y)

  const gapX = 16
  const gapY = 16

  const sx = Math.min(...xs)
  const sy = Math.min(...ys)
  const ex = Math.max(...xs) + nodeWidth
  const ey = Math.max(...ys) + nodeHeight

  const left = sx - gapX
  const top = sy - gapY
  const width = ex - sx + 2 * gapX
  const height = ey - sy + 2 * gapY

  const openerStyle: CSSProperties = { position: 'absolute', right: 5, top: -2, cursor: 'pointer' }

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        border: '1px solid cyan',
        transition: 'all .3s ease-in',
      }}
    >
      <div style={openerStyle} onClick={onToggle}>
        {isOpen ? '-' : '+'}
      </div>
    </div>
  )
}

interface ISubgraphBox {
  nodes: INode[]
}

const MyNode = ({ x, y, width = nodeWidth, height = nodeHeight, label = 'myNode' }: INode) => (
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

const getPath = ({ x1, y1, x2, y2 }: P): string => {
  const cx = x1 + (x2 - x1) / 2
  const path = `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`

  return path
}

interface INode {
  x: number
  y: number
  label: string
  width?: number
  height?: number
}

interface P {
  x1: number
  y1: number
  x2: number
  y2: number
}

export default NodeExpand

export interface Props {}
