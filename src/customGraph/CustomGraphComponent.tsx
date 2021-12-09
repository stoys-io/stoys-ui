import React, { CSSProperties, ReactNode, useState } from 'react'
import { mockGraph } from './mocks'

const timeout = '350ms'
const styleEdgeTransition = {
  transition: `all ${timeout} ease-in-out`,
}
const STROKE = '#b1b1b7'

const CustomGraphComponent = ({
  graph = mockGraph,
  nodeComponent = undefined,
  nodeHeight = 40,
  nodeWidth = 60,
  onPaneClick = () => {},
}: Props) => {
  const [isOpen, setIsOpen] = useState(true)
  const [scale, setScale] = useState(1)

  const toggle = () => setIsOpen(isOpen => !isOpen)

  const strokeTransition = isOpen ? STROKE : 'white'
  const strokeWidthTransition = isOpen ? '1' : '0'

  const myNodes = Object.values(graph.nodes)
  const plainNodes = myNodes.filter(node => node.groupId === undefined)

  const subGroups = myNodes.reduce(
    (acc: string[], node: CustomGraphNode<Payload>) =>
      node.groupId ? [...acc, node.groupId] : acc,
    []
  )

  const dummyZoom = (evt: React.WheelEvent) => {
    const nextScale = scale + evt.deltaY * -0.01
    const actualScale = Math.min(Math.max(0.125, nextScale), 4)
    setScale(actualScale)
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        transform: `scale(${scale})`,
      }}
      onWheel={dummyZoom}
      onClick={onPaneClick}
    >
      <svg style={styleSvgContainer}>
        {graph.edges.map(edge => {
          const {
            position: { x: x1, y: y1 },
            rootId: rootSource,
          } = graph.nodes[edge.source]
          const {
            position: { x: x2, y: y2 },
            rootId: rootTarget,
          } = graph.nodes[edge.target]

          const rootId = rootSource || rootTarget
          if (rootId) {
            const { x: xRoot, y: yRoot } = graph.nodes[rootId].position

            let dPath = ''
            if (rootTarget) {
              const [x2anim, y2anim] = isOpen ? [x2, y2] : [xRoot, yRoot]
              dPath = getPath(handleCoords(x1, y1, x2anim, y2anim, nodeWidth, nodeHeight))
            }

            if (rootSource) {
              const [x1anim, y1anim] = isOpen ? [x1, y1] : [xRoot, yRoot]
              dPath = getPath(handleCoords(x1anim, y1anim, x2, y2, nodeWidth, nodeHeight))
            }

            return (
              <path
                key={`${edge.source}${edge.target}`}
                d={dPath}
                fill="transparent"
                stroke={strokeTransition}
                strokeWidth={strokeWidthTransition}
                style={styleEdgeTransition}
              />
            )
          }

          return (
            <path
              key={`${edge.source}${edge.target}`}
              d={getPath(handleCoords(x1, y1, x2, y2, nodeWidth, nodeHeight))}
              stroke={STROKE}
              strokeWidth="1"
              fill="transparent"
            />
          )
        })}
      </svg>

      {plainNodes.map(node => (
        <MyNode
          key={node.id}
          id={node.id}
          x={node.position.x}
          y={node.position.y}
          label={node.data.label}
          width={nodeWidth}
          height={nodeHeight}
        >
          {nodeComponent && nodeComponent({ id: node.id, data: node.data })}
        </MyNode>
      ))}

      {subGroups.map((group, idx) => {
        const subgraph = myNodes.filter(node => node.groupId === group)
        return (
          <Subgraph
            key={`${group}-${idx}`}
            nodes={subgraph}
            isOpen={isOpen}
            onToggle={toggle}
            component={nodeComponent}
            nodeWidth={nodeWidth}
            nodeHeight={nodeHeight}
          />
        )
      })}
    </div>
  )
}

const styleSvgContainer: CSSProperties = {
  position: 'absolute',
  width: '100%',
  height: '100%',
}

const Subgraph = ({ nodes, isOpen, onToggle, component, nodeHeight, nodeWidth }: ISubgraph) => {
  let nodes2 = nodes

  if (!isOpen) {
    const rootNode = nodes.find(node => !node.rootId) || nodes[0]
    nodes2 = nodes.map(node =>
      node.rootId
        ? {
            ...node,
            position: { x: rootNode.position.x, y: rootNode.position.y },
          }
        : node
    )
  }

  return (
    <>
      <SubgraphBox
        nodes={nodes2}
        isOpen={isOpen}
        onToggle={onToggle}
        nodeHeight={nodeHeight}
        nodeWidth={nodeWidth}
      />
      {nodes2.map((node, idx) => (
        <MyNode
          key={node.id}
          id={node.id}
          x={node.position.x}
          y={node.position.y}
          label={node.data.label}
          fade={!isOpen && idx !== 0}
          width={nodeWidth}
          height={nodeHeight}
        >
          {component && component({ id: node.id, data: node.data })}
        </MyNode>
      ))}
    </>
  )
}

interface ISubgraph extends ISubgraphBox {
  isOpen: boolean
  onToggle: () => void
  nodeWidth: number
  nodeHeight: number
  component?: (_: any) => ReactNode
}

const SubgraphBox = ({ nodes, isOpen, onToggle, nodeWidth, nodeHeight }: ISubgraph) => {
  const xs = nodes.map(n => n.position.x)
  const ys = nodes.map(n => n.position.y)

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

  const openerStyle: CSSProperties = {
    position: 'absolute',
    right: 3,
    top: -2,
    cursor: 'pointer',
    lineHeight: 1,
  }

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        border: '1px solid cyan',
        transition: `all ${timeout} ease-in-out`,
      }}
    >
      <div style={openerStyle} onClick={onToggle}>
        {isOpen ? '-' : '+'}
      </div>
    </div>
  )
}

interface ISubgraphBox {
  nodes: CustomGraphNode<Payload>[]
}

const MyNode = ({ x, y, width, height, label = 'myNode', fade = false, children }: INode) => {
  const opacity = fade
    ? {
        opacity: 0,
      }
    : {
        opacity: 1,
      }

  if (children) {
    return (
      <div
        style={{
          position: 'absolute',
          top: y,
          left: x,
          width,
          height,
          transition: `all ${timeout} ease-in-out`,
          ...opacity,
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: x,
        width,
        height,
        border: '1px solid magenta',
        transition: `all ${timeout} ease-in-out`,
        ...opacity,
      }}
    >
      {label}
    </div>
  )
}

const getPath = ({ x1, y1, x2, y2 }: P): string => {
  const cx = x1 + (x2 - x1) / 2
  const path = `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`

  return path
}

interface INode {
  id: string
  x: number
  y: number
  label: string
  width: number
  height: number
  fade?: boolean
  children: ReactNode
}

interface P {
  x1: number
  y1: number
  x2: number
  y2: number
}

export default CustomGraphComponent
export interface Props {
  graph: CustomGraph
  nodeComponent?: (_: any) => ReactNode
  nodeHeight?: number
  nodeWidth?: number
  onPaneClick?: () => void
}

const handleCoords = (
  x2: number,
  y2: number,
  x1: number,
  y1: number,
  width: number,
  height: number
) => ({
  x1: x1 + width,
  y1: y1 + height / 2,
  x2,
  y2: y2 + height / 2,
})

interface Payload {
  label: string
}

export interface CustomGraph {
  nodes: { [key: string]: CustomGraphNode<Payload> }
  edges: CustomGraphEdge[]
}

interface CustomGraphNode<T> {
  id: string
  position: CustomGraphPosition
  data: T

  groupId?: string
  rootId?: string
}

interface CustomGraphPosition {
  x: number
  y: number
}

interface CustomGraphEdge {
  source: string
  target: string
}
