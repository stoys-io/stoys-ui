import React, { CSSProperties, ReactNode, useEffect, useRef } from 'react'
import create from 'zustand'
import createContext from 'zustand/context'

import Edge, { Props as EdgeProps } from './Edge'
import Node, { defaultNode } from './Node'
import { ANIMATION_TIMEOUT, DEFAULT_EDGE_COLOR } from './constants'

import { usePanZoom } from './usePanZoom'
import { createEdgePath } from './createEdgePath'

interface NodeGroupState {
  init: boolean
  groups: NodeGroups
  setInitialGroups: (_: NodeGroups) => void
  toggleGroup: (_: string) => void
}

interface NodeGroups {
  [key: string]: boolean
}

const { Provider, useStore } = createContext<NodeGroupState>()
const NodeGroupsProvider = ({ children }: { children: ReactNode }) => {
  return <Provider createStore={createStore}>{children}</Provider>
}

const createStore = () =>
  create<NodeGroupState>(set => ({
    init: false,
    groups: {},
    setInitialGroups: (groups: NodeGroups) => set({ init: true, groups }),
    toggleGroup: (group: string) =>
      set(state => {
        const groupState = state.groups[group]
        return { groups: { ...state.groups, [group]: !groupState } }
      }),
  }))

const CustomGraphComponent = ({
  graph,
  nodeComponent = undefined,
  edgeComponent = undefined,
  nodeHeight = 40,
  nodeWidth = 60,
  minScale = 0.12,
  maxScale = 2,
  onPaneClick = () => {},
}: Props) => {
  const myNodes = Object.values(graph.nodes)
  const plainNodes = myNodes.filter(node => node.groupId === undefined)

  const subGroups = myNodes.reduce(
    (acc: string[], node: CustomGraphNode<Payload>) =>
      node.groupId ? [...acc, node.groupId] : acc,
    []
  )

  const initialGroupState = subGroups.reduce((acc, item) => ({ ...acc, [item]: false }), {})
  const groups = useStore(state => (state.init ? state.groups : initialGroupState))
  const setInitialGroups = useStore(state => state.setInitialGroups)
  const toggleGroup = useStore(state => state.toggleGroup)

  const getPath = createEdgePath(nodeWidth, nodeHeight)

  const ActualEdge = edgeComponent ? edgeComponent : Edge

  const nodeXS = myNodes.map(node => node.position.x)
  const nodeYS = myNodes.map(node => node.position.y)
  const svgViewportWidth = Math.max(...nodeXS) + 2 * nodeWidth
  const svgViewportHeight = Math.max(...nodeYS) + 2 * nodeHeight

  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const zoomContainerRef = useRef<HTMLDivElement>(null)

  usePanZoom({ canvasContainerRef, zoomContainerRef, minScale, maxScale, onPaneClick })

  useEffect(() => {
    setInitialGroups(initialGroupState)
  }, [])

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
              } = graph.nodes[edge.source]
              const {
                position: { x: x2, y: y2 },
                rootId: targetRootId,
                groupId: targetGroupId,
              } = graph.nodes[edge.target]

              // Group edges:
              const isEdgeOutbound = sourceGroupId !== targetGroupId
              const isTargetGroupOpen = targetGroupId && groups[targetGroupId]
              const isSourceGroupOpen = sourceGroupId && groups[sourceGroupId]

              const isRegularEdge = !sourceRootId && !targetRootId
              const isGroupOpenInboundEdge =
                !isEdgeOutbound && (isTargetGroupOpen || isSourceGroupOpen)

              if (isRegularEdge || isGroupOpenInboundEdge) {
                return (
                  <ActualEdge
                    key={edge.id}
                    id={edge.id}
                    path={getPath(x2, y2, x1, y1)}
                    isVisible={true}
                    color={DEFAULT_EDGE_COLOR}
                  />
                )
              }

              if (!isEdgeOutbound && (sourceRootId || targetRootId)) {
                // Inbound edge closed group
                const { x: xRoot, y: yRoot } = sourceRootId
                  ? graph.nodes[sourceRootId].position
                  : graph.nodes[targetRootId!].position

                const dPath = sourceRootId
                  ? getPath(x2, y2, xRoot, yRoot)
                  : getPath(xRoot, yRoot, x1, y1)

                return (
                  <ActualEdge
                    key={edge.id}
                    id={edge.id}
                    path={dPath}
                    isVisible={false}
                    color={DEFAULT_EDGE_COLOR}
                  />
                )
              }

              // TODO: Simplify
              if (sourceRootId) {
                // Outbound edge
                const { x: xRoot, y: yRoot } = graph.nodes[sourceRootId].position
                const isTargetVisible = targetGroupId === undefined || isTargetGroupOpen
                const outBoundCase1 = isTargetVisible && !isSourceGroupOpen
                const outBoundCase2 = !isTargetVisible && !isSourceGroupOpen
                const outBoundCase3 = isTargetVisible && isSourceGroupOpen
                const outBoundCase4 = !isTargetVisible && isSourceGroupOpen

                let dPath = ''
                if (outBoundCase1) {
                  dPath = getPath(x2, y2, xRoot, yRoot)
                }

                if (outBoundCase2) {
                  const { x: xRootOther, y: yRootOther } = graph.nodes[targetRootId!].position
                  dPath = getPath(xRootOther, yRootOther, xRoot, yRoot)
                }

                if (outBoundCase3) {
                  dPath = getPath(x2, y2, x1, y1)
                }

                if (outBoundCase4) {
                  const { x: xRootOther, y: yRootOther } = graph.nodes[targetRootId!].position
                  dPath = getPath(xRootOther, yRootOther, x1, y1)
                }

                return (
                  <ActualEdge
                    key={edge.id}
                    id={edge.id}
                    path={dPath}
                    isVisible={true}
                    color={DEFAULT_EDGE_COLOR}
                  />
                )
              }

              if (targetRootId) {
                // Outbound edge
                const { x: xRoot, y: yRoot } = graph.nodes[targetRootId].position
                const isSourceVisible = sourceGroupId === undefined || isSourceGroupOpen
                const outBoundCase1 = isSourceVisible && !isTargetGroupOpen
                const outBoundCase2 = !isSourceVisible && !isTargetGroupOpen
                const outBoundCase3 = isSourceVisible && isTargetGroupOpen
                const outBoundCase4 = !isSourceVisible && isTargetGroupOpen

                let dPath = ''
                if (outBoundCase1) {
                  dPath = getPath(xRoot, yRoot, x1, y1)
                }

                if (outBoundCase2) {
                  const { x: xRootOther, y: yRootOther } = graph.nodes[sourceRootId!].position
                  dPath = getPath(xRoot, yRoot, xRootOther, yRootOther)
                }

                if (outBoundCase3) {
                  dPath = getPath(x2, y2, x1, y1)
                }

                if (outBoundCase4) {
                  const { x: xRootOther, y: yRootOther } = graph.nodes[sourceRootId!].position
                  dPath = getPath(x2, y2, xRootOther, yRootOther)
                }

                return (
                  <ActualEdge
                    key={edge.id}
                    id={edge.id}
                    path={dPath}
                    isVisible={true}
                    color={DEFAULT_EDGE_COLOR}
                  />
                )
              }
            })}
          </g>
        </svg>

        <div>
          {plainNodes.map(node => (
            <Node
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
            </Node>
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
        <Node
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
        </Node>
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
        transition: `all ${ANIMATION_TIMEOUT} ease-in-out`,
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

const WrappedCustomGraph = (props: Props) => (
  <NodeGroupsProvider>
    <CustomGraphComponent {...props} />
  </NodeGroupsProvider>
)

export default WrappedCustomGraph

export interface Props {
  graph: CustomGraph
  nodeComponent?: (_: any) => JSX.Element
  edgeComponent?: (props: EdgeProps) => JSX.Element
  nodeHeight?: number
  nodeWidth?: number
  minScale?: number
  maxScale?: number
  onPaneClick?: () => void
}

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
