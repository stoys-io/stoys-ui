import React, { CSSProperties, useRef } from 'react'
import uniq from 'lodash.uniq'

import GroupStateProvider, { useStore } from './GroupStateProvider'

import { Edge, NodePosition, DefaultNode, BubbleSet } from './components'
import { ANIMATION_TIMEOUT } from './constants'
import { createEdgePath } from './createEdgePath'
import { GraphData, NodeData, EdgeProps, NodeIndex, GroupIndex, Position } from './types'
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

  const groupIndex = g.nodes.reduce((acc: GroupIndex, node: NodeData): GroupIndex => {
    if (!node.groupId) {
      return acc
    }

    if (!acc[node.groupId]) {
      return { ...acc, [node.groupId]: [node.id] }
    }

    return { ...acc, [node.groupId]: [...acc[node.groupId], node.id] }
  }, {})

  const nodeIndexOriginal: NodeIndex = g.nodes.reduce(
    (acc, node) => ({
      ...acc,
      [node.id]: node,
    }),
    {}
  )

  /* const graph = withDagreLayout ? graphLayout(g, nodeWidth, nodeHeight, groups) : g */

  const { graph, groupNodes: gn, rootNodes } = graphLayout(g, nodeWidth, nodeHeight, groups)

  const nodeIndex: NodeIndex = graph.nodes.reduce(
    (acc, node) => ({
      ...acc,
      [node.id]: node,
    }),
    {}
  )

  const groupNodePosition = (groupId: string) => {
    const rn = rootNodes.find(n => n.group === groupId)?.position ?? { x: 0, y: 0 }

    return { x: rn.x, y: rn.y }
  }

  const plainNodes = graph.nodes.filter(node => node.groupId === undefined)
  const groupList = uniq(
    graph.nodes.reduce(
      (acc: string[], node: NodeData) => (node.groupId ? [...acc, node.groupId] : acc),
      []
    )
  ) as string[]

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
              const { position, isHidden } = edgePosition(
                edge,
                nodeIndex,
                groups,
                groupIndex,
                groupNodePosition
              )
              const dPath = getPath(...position)

              return <ActualEdge key={edge.id} id={edge.id} path={dPath} fade={isHidden} />
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

          {gn.map(groupNode => (
            <div onClick={() => toggleGroup(groupNode.group)} key={`${groupNode.id}-groupNode`}>
              <NodePosition position={groupNode.position}>
                <DefaultNode width={groupNode.width} height={groupNode.height} />
              </NodePosition>
            </div>
          ))}

          {rootNodes.map(rootNode => (
            <NodePosition position={rootNode.position} key={`${rootNode.id}-rootNode`}>
              <TableListNode
                label={rootNode.group}
                tableList={groupIndex[rootNode.group].map(
                  nId => nodeIndexOriginal[nId].data?.label
                )}
              />
            </NodePosition>
          ))}

          {groupList.map(groupId => {
            const subgraph = graph.nodes.filter(node => node.groupId === groupId)
            return (
              <Subgraph
                key={`${groupId}-subgraph`}
                nodes={subgraph}
                groupId={groupId}
                isOpen={groups[groupId]}
                onToggle={() => toggleGroup(groupId)}
                nodeComponent={ActualNode}
                nodeWidth={nodeWidth}
                nodeHeight={nodeHeight}
                groupNodePosition={groupNodePosition}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

const Subgraph = ({
  nodes,
  isOpen,
  onToggle,
  nodeComponent,
  nodeHeight,
  nodeWidth,
  groupId,
  groupNodePosition,
}: ISubgraph) => {
  const nodes2 = isOpen
    ? nodes
    : nodes.map(node => ({
        ...node,
        position: groupNodePosition(groupId),
      }))

  return (
    <>
      {nodes2.map(node => (
        <NodePosition key={node.id} position={node.position} fade={!isOpen}>
          {nodeComponent({
            ...node,
          })}
        </NodePosition>
      ))}
    </>
  )
}

interface ISubgraph {
  nodes: NodeData[]
  groupId: string
  groupNodePosition: (groupId: string) => Position

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
