import React, { CSSProperties, ReactNode, useRef, useEffect } from 'react'
import create from 'zustand'
import Panzoom from '@panzoom/panzoom'

import { mockGraph } from './mocks'

const timeout = '3500ms'

const STROKE = '#b1b1b7'

interface NestedState {
  groups: { [key: string]: boolean }
  toggleGroup: (_: string) => void
}

const useStore = create<NestedState>(set => ({
  groups: {},
  toggleGroup: (group: string) =>
    set(state => {
      const groupState = state.groups[group]
      return { groups: { ...state.groups, [group]: !groupState } }
    }),
}))

const CustomGraphComponent = ({
  graph = mockGraph,
  nodeComponent = undefined,
  edgeComponent = undefined,
  nodeHeight = 40,
  nodeWidth = 60,
  minScale = 0.12,
  maxScale = 2,
  onPaneClick = () => {},
}: Props) => {
  const groups = useStore(state => state.groups)
  const toggleGroup = useStore(state => state.toggleGroup)

  const myNodes = Object.values(graph.nodes)
  const plainNodes = myNodes.filter(node => node.groupId === undefined)

  const subGroups = myNodes.reduce(
    (acc: string[], node: CustomGraphNode<Payload>) =>
      node.groupId ? [...acc, node.groupId] : acc,
    []
  )

  const CustomEdge = edgeComponent ? edgeComponent : Edge

  const nodeXS = myNodes.map(node => node.position.x)
  const nodeYS = myNodes.map(node => node.position.y)
  const svgViewportWidth = Math.max(...nodeXS) + 2 * nodeWidth
  const svgViewportHeight = Math.max(...nodeYS) + 2 * nodeHeight

  const zoomContainerRef = useRef<HTMLDivElement>(null)
  const rootContainer = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!zoomContainerRef.current || !rootContainer.current) {
      return
    }

    const panzoom = Panzoom(zoomContainerRef.current, {
      minScale,
      maxScale,
      cursor: 'default',
      step: 0.2,
      canvas: true,
      animate: true,
      excludeClass: 'preventZoom',
    })

    const onWheel = (evt: WheelEvent) => {
      const shouldPreventZoom = (evt.target as Element).closest('.preventZoom')
      if (shouldPreventZoom) {
        return
      }

      panzoom.zoomWithWheel(evt)
    }

    rootContainer.current.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      rootContainer.current?.removeEventListener('wheel', onWheel)
    }
  }, [zoomContainerRef.current, rootContainer.current])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
      ref={rootContainer}
      onClick={onPaneClick}
    >
      <div ref={zoomContainerRef}>
        <svg
          style={{
            position: 'absolute',
            width: svgViewportWidth,
            height: svgViewportHeight,
          }}
        >
          <g>
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
                const curGroup = graph.nodes[rootId].groupId!
                const isOpen = groups[curGroup]

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
                  <CustomEdge
                    key={edge.id}
                    id={edge.id}
                    path={dPath}
                    isVisible={isOpen}
                    color={STROKE}
                  />
                )
              }

              return (
                <CustomEdge
                  key={edge.id}
                  id={edge.id}
                  path={getPath(handleCoords(x1, y1, x2, y2, nodeWidth, nodeHeight))}
                  isVisible={true}
                  color={STROKE}
                />
              )
            })}
          </g>
        </svg>

        <div>
          {plainNodes.map(node => (
            <MyNode
              key={node.id}
              id={node.id}
              x={node.position.x}
              y={node.position.y}
              width={nodeWidth}
              height={nodeHeight}
            >
              {nodeComponent
                ? nodeComponent({ id: node.id, data: node.data })
                : defaultNode({ label: node.data.label })}
            </MyNode>
          ))}

          {subGroups.map((group, idx) => {
            const subgraph = myNodes.filter(node => node.groupId === group)
            return (
              <Subgraph
                key={`${group}-${idx}`}
                nodes={subgraph}
                isOpen={groups[group]}
                onToggle={() => toggleGroup(group)}
                component={nodeComponent}
                nodeWidth={nodeWidth}
                nodeHeight={nodeHeight}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export interface EdgeProps {
  id: string
  path: string
  color: string
  isVisible: boolean
}

const edgeStyle = { transition: `all ${timeout} ease-in-out` }
export const Edge = ({ path: d, id, color, isVisible }: EdgeProps) => {
  const strokeOpacity = isVisible ? '1' : '0'
  const strokeWidth = isVisible ? '1' : '0' // TODO: Actually we don't need this. strokeOpacity is enough

  return (
    <path
      key={id}
      d={d}
      style={edgeStyle}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity}
      fill="transparent"
    />
  )
}

const Subgraph = ({ nodes, isOpen, onToggle, component, nodeHeight, nodeWidth }: ISubgraph) => {
  let nodes2 = nodes
  let rootId: string | undefined = undefined

  if (!isOpen) {
    const rootNode = nodes.find(node => !node.rootId) || nodes[0]
    rootId = rootNode.id
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
      {nodes2.map(node => (
        <MyNode
          key={node.id}
          id={node.id}
          x={node.position.x}
          y={node.position.y}
          fade={!isOpen && node.id !== rootId}
          width={nodeWidth}
          height={nodeHeight}
        >
          {component
            ? component({ id: node.id, data: node.data })
            : defaultNode({ label: node.data.label })}
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
        border: `2px solid cyan`,
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

const defaultNode = ({ label }: { label: string }) => (
  <div style={{ border: '1px solid magenta', width: '100%', height: '100%' }}>{label}</div>
)

const MyNode = ({ x, y, width, height, fade = false, children = defaultNode }: NodeProps) => {
  const opacity = fade
    ? {
        opacity: 0,
      }
    : {
        opacity: 1,
      }

  return (
    <div
      className="preventZoom"
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

const getPath = ({ x1, y1, x2, y2 }: P): string => {
  const cx = x1 + (x2 - x1) / 2
  const path = `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`

  return path
}

export interface NodeProps {
  id: string
  x: number
  y: number
  width: number
  height: number
  children: ReactNode
  fade?: boolean
}

interface P {
  x1: number
  y1: number
  x2: number
  y2: number
}

export default CustomGraphComponent
export interface Props {
  graph?: CustomGraph
  nodeComponent?: (_: any) => JSX.Element
  edgeComponent?: (props: EdgeProps) => JSX.Element
  nodeHeight?: number
  nodeWidth?: number
  minScale?: number
  maxScale?: number
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
  id: string
  source: string
  target: string
}
