import React, { CSSProperties, useRef } from 'react'

import GroupStateProvider, { useStore } from './GroupStateProvider'

import { Edge, NodePosition, DefaultNode, BubbleSet } from './components'
import { ANIMATION_TIMEOUT } from './constants'
import { createEdgePath } from './createEdgePath'
import { GraphData, NodeData, EdgeProps } from './types'
import { graphLayout } from './graph-layout'

import { usePanZoom } from './usePanZoom'

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
  const graph = withDagreLayout ? graphLayout(g, nodeWidth, nodeHeight) : g
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

  const groups = useStore(state => state.groups)
  const toggleGroup = useStore(state => state.toggleGroup)

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
              const {
                position: { x: x1, y: y1 },
                rootId: sourceRootId,
                groupId: sourceGroupId,
              } = nodeIndex[edge.source]
              const {
                position: { x: x2, y: y2 },
                rootId: targetRootId,
                groupId: targetGroupId,
              } = nodeIndex[edge.target]

              // Group edges:
              const isEdgeOutbound = sourceGroupId !== targetGroupId
              const isTargetGroupOpen = targetGroupId && groups[targetGroupId]
              const isSourceGroupOpen = sourceGroupId && groups[sourceGroupId]

              const isRegularEdge = !sourceRootId && !targetRootId
              const isGroupOpenInboundEdge =
                !isEdgeOutbound && (isTargetGroupOpen || isSourceGroupOpen)

              if (isRegularEdge || isGroupOpenInboundEdge) {
                return <ActualEdge key={edge.id} id={edge.id} path={getPath(x2, y2, x1, y1)} />
              }

              if (!isEdgeOutbound && (sourceRootId || targetRootId)) {
                // Inbound edge closed group
                const { x: xRoot, y: yRoot } = sourceRootId
                  ? nodeIndex[sourceRootId].position
                  : nodeIndex[targetRootId!].position

                const dPath = sourceRootId
                  ? getPath(x2, y2, xRoot, yRoot)
                  : getPath(xRoot, yRoot, x1, y1)

                return <ActualEdge key={edge.id} id={edge.id} path={dPath} fade />
              }

              // TODO: This could have been simpler
              // Outbound edge:
              const thisRootId = sourceRootId ? sourceRootId : targetRootId
              const otherRootId = sourceRootId ? targetRootId : sourceRootId

              const { x: xThisRoot, y: yThisRoot } = nodeIndex[thisRootId!].position

              const thisGroupOpen = sourceRootId ? isSourceGroupOpen : isTargetGroupOpen
              const otherNodeVisible = sourceRootId
                ? targetGroupId === undefined || isTargetGroupOpen
                : sourceGroupId === undefined || isSourceGroupOpen

              const outboundCase1 = !thisGroupOpen && otherNodeVisible
              const outboundCase2 = !thisGroupOpen && !otherNodeVisible
              const outboundCase3 = thisGroupOpen && otherNodeVisible
              const outboundCase4 = thisGroupOpen && !otherNodeVisible

              let dPath = ''
              if (outboundCase1) {
                dPath = sourceRootId
                  ? getPath(x2, y2, xThisRoot, yThisRoot)
                  : getPath(xThisRoot, yThisRoot, x1, y1)
              }

              if (outboundCase2) {
                const { x: xOtherRoot, y: yOtherRoot } = nodeIndex[otherRootId!].position
                dPath = sourceRootId
                  ? getPath(xOtherRoot, yOtherRoot, xThisRoot, yThisRoot)
                  : getPath(xThisRoot, yThisRoot, xOtherRoot, yOtherRoot)
              }

              if (outboundCase3) {
                dPath = getPath(x2, y2, x1, y1)
              }

              if (outboundCase4) {
                const { x: xOtherRoot, y: yOtherRoot } = nodeIndex[otherRootId!].position
                dPath = sourceRootId
                  ? getPath(xOtherRoot, yOtherRoot, x1, y1)
                  : getPath(x2, y2, xOtherRoot, yOtherRoot)
              }

              return <ActualEdge key={edge.id} id={edge.id} path={dPath} />
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
        <NodePosition key={node.id} position={node.position} fade={!isOpen && node.id !== rootId}>
          {nodeComponent({
            ...node,
          })}
        </NodePosition>
      ))}
    </>
  )
}

interface ISubgraph extends ISubgraphBox {
  nodeComponent: (props: NodeData) => JSX.Element
}

const SubgraphBox = ({ nodes, isOpen, onToggle, nodeWidth, nodeHeight }: ISubgraphBox) => {
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
  nodes: NodeData[]
  isOpen: boolean
  onToggle: () => void
  nodeWidth: number
  nodeHeight: number
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

interface NodeIndex {
  [key: string]: NodeData
}
