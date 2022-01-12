import React, { CSSProperties, useRef } from 'react'

import GroupStateProvider, { useStore } from './GroupStateProvider'

import { Edge, NodePosition, DefaultNode, BubbleSet } from './components'
import { ANIMATION_TIMEOUT } from './constants'
import { createEdgePath, createEdgePath2, transformControlPoint } from './createEdgePath'
import { GraphData, NodeData, EdgeProps, NodeIndex, GroupIndex } from './types'
import { graphLayout } from './graph-layout'

import { usePanZoom } from './usePanZoom'
import TableListNode from '../graph/TableListNode'
import { edgePosition } from './edge-position'

const CustomGraph = ({
  graph: g,
  nodeHeight,
  nodeWidth,
  bubbleSets = undefined,
  nodeComponent = undefined,
  edgeComponent = undefined,
  minScale = 0.12,
  maxScale = 2,
  onPaneClick = () => {},
  withDagreLayout = true,
}: Props) => {
  const groups = useStore(state => state.groups)
  const toggleGroup = useStore(state => state.toggleGroup)

  const graph = withDagreLayout ? graphLayout(g, nodeWidth, nodeHeight, groups) : g
  const nodeIndex: NodeIndex = graph.nodes.reduce(
    (acc, node) => ({
      ...acc,
      [node.id]: node,
    }),
    {}
  )

  const plainNodes = graph.nodes.filter(node => node.groupId === undefined)
  const subGroups = graph.nodes.reduce(
    (acc: string[], node: NodeData) => (node.groupId ? [...acc, node.groupId] : acc),
    []
  )

  const groupIndex = graph.nodes.reduce((acc: GroupIndex, node: NodeData): GroupIndex => {
    if (!node.groupId) {
      return acc
    }

    if (!acc[node.groupId]) {
      return { ...acc, [node.groupId]: [node.id] }
    }

    return { ...acc, [node.groupId]: [...acc[node.groupId], node.id] }
  }, {})

  const bubbleSetList = !bubbleSets
    ? []
    : Object.values(bubbleSets).map(nodeList => {
        const bubbleNodes = nodeList.map(item => {
          const position = nodeIndex[item].position
          return { ...position, width: nodeWidth, height: nodeHeight }
        })

        const bubbleOtherNodes = graph.nodes
          .filter(node => !nodeList.includes(node.id))
          .map(node => {
            const position = node.position
            return { ...position, width: nodeWidth, height: nodeHeight }
          })

        return { nodes: bubbleNodes, otherNodes: bubbleOtherNodes }
      })

  const getPath = createEdgePath(nodeWidth, nodeHeight)
  const getPath2 = createEdgePath2(nodeWidth, nodeHeight)

  const ActualEdge = edgeComponent ? edgeComponent : Edge
  const ActualNode = nodeComponent ? nodeComponent : DefaultNode

  const nodeXS = graph.nodes.map(node => node.position.x)
  const nodeYS = graph.nodes.map(node => node.position.y)
  const svgViewportWidth = Math.max(...nodeXS) + 2 * nodeWidth
  const svgViewportHeight = Math.max(...nodeYS) + 2 * nodeHeight

  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const zoomContainerRef = useRef<HTMLDivElement>(null)

  usePanZoom({
    canvasContainerRef,
    zoomContainerRef,
    excludeClass: 'preventZoom',
    minScale,
    maxScale,
    onPaneClick,
  })

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
      ref={canvasContainerRef}
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
              const { position, isHidden } = edgePosition(edge, nodeIndex, groups, groupIndex)
              const dPath = getPath(...position)
              const dPath2 = edge.points ? getPath2(...position, edge.points) : ''

              console.log({ dPath2 })
              return (
                <>
                  {edge.points
                    ?.map(point =>
                      transformControlPoint({
                        x: point.x,
                        y: point.y,
                        x1: position[0],
                        x2: position[2],
                        nodeWidth,
                        nodeHeight,
                      })
                    )
                    .map(point => (
                      <circle cx={point.x} cy={point.y} r={5} fill="blue" />
                    ))}
                  <Edge key={`curvedEdge-${edge.id}`} id={edge.id} path={dPath2} color="red" />
                  <ActualEdge key={edge.id} id={edge.id} path={dPath} fade={isHidden} />
                </>
              )
            })}
          </g>
          <BubbleSet bubbleSetList={bubbleSetList} />
        </svg>

        <div>
          {plainNodes.map(node => (
            <NodePosition position={node.position} key={node.id}>
              <ActualNode {...node} />
            </NodePosition>
          ))}

          {subGroups.map((group, idx) => {
            const subgraph = graph.nodes.filter(node => node.groupId === group)
            return (
              <Subgraph
                key={`${group}-${idx}`}
                nodes={subgraph}
                isOpen={groups[group]}
                onToggle={() => toggleGroup(group)}
                nodeComponent={ActualNode}
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

const Subgraph = ({ nodes, isOpen, onToggle, nodeComponent, nodeHeight, nodeWidth }: ISubgraph) => {
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

  const xs = nodes2.map(n => n.position.x)
  const ys = nodes2.map(n => n.position.y)

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

  return (
    <>
      <SubgraphBox
        left={left}
        top={top}
        width={width}
        height={height}
        isOpen={isOpen}
        onToggle={onToggle}
      />
      {nodes2.map(node =>
        !node.rootId && !isOpen ? (
          <NodePosition key={node.id} position={node.position}>
            <TableListNode
              label={nodes2[0].groupId || ''}
              tableList={nodes2.map(n => n.data?.label)}
            />
          </NodePosition>
        ) : (
          <NodePosition key={node.id} position={node.position} fade={!isOpen}>
            {nodeComponent({
              ...node,
            })}
          </NodePosition>
        )
      )}
    </>
  )
}

interface ISubgraph {
  nodes: NodeData[]

  isOpen: boolean
  onToggle: () => void

  nodeWidth: number
  nodeHeight: number
  nodeComponent: (props: NodeData) => JSX.Element
}

const SubgraphBox = ({ left, top, width, height, isOpen, onToggle }: ISubgraphBox) => {
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
        transition: `all ${ANIMATION_TIMEOUT} ease-in-out`,
      }}
    >
      <div style={openerStyle} onClick={onToggle} className="preventZoom">
        {isOpen ? '-' : '+'}
      </div>
    </div>
  )
}

interface ISubgraphBox {
  left: number
  top: number
  width: number
  height: number
  isOpen: boolean
  onToggle: () => void
}

const WrappedCustomGraph = (props: Props) => {
  const initialGroups = props.graph.nodes
    .reduce((acc: string[], node: NodeData) => (node.groupId ? [...acc, node.groupId] : acc), [])
    .reduce((acc, item) => ({ ...acc, [item]: true }), {}) // Expand groups by default

  return (
    <GroupStateProvider initialGroups={initialGroups}>
      <CustomGraph {...props} />
    </GroupStateProvider>
  )
}

export default WrappedCustomGraph

export interface Props {
  graph: GraphData
  nodeHeight: number
  nodeWidth: number
  bubbleSets?: BubbleSets
  nodeComponent?: (props: NodeData) => JSX.Element
  edgeComponent?: (props: EdgeProps) => JSX.Element
  minScale?: number
  maxScale?: number
  onPaneClick?: () => void
  withDagreLayout?: boolean
}

interface BubbleSets {
  [key: string]: string[]
}
