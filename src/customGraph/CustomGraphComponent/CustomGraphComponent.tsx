import React, { CSSProperties, ReactNode, useEffect, useRef } from 'react'
import create from 'zustand'
import createContext from 'zustand/context'

import Edge, { Props as EdgeProps } from './Edge'
import Node, { defaultNode } from './Node'
import { ANIMATION_TIMEOUT, DEFAULT_EDGE_COLOR } from './constants'

import { usePanZoom } from './usePanZoom'

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

              // TODO: Simplify

              if (sourceRootId) {
                const { x: xRoot, y: yRoot } = graph.nodes[sourceRootId].position
                const isOpen = groups[sourceGroupId!]
                const isEdgeOutbound = sourceGroupId !== targetGroupId
                if (!isEdgeOutbound) {
                  // Inbound edge
                  const [x1anim, y1anim] = isOpen ? [x1, y1] : [xRoot, yRoot]
                  const dPath = getPath(handleCoords(x1anim, y1anim, x2, y2, nodeWidth, nodeHeight))
                  return (
                    <ActualEdge
                      key={edge.id}
                      id={edge.id}
                      path={dPath}
                      isVisible={isOpen}
                      color={DEFAULT_EDGE_COLOR}
                    />
                  )
                }

                const isTargetVisible =
                  isEdgeOutbound &&
                  (targetGroupId === undefined || (targetGroupId && groups[targetGroupId]))

                const outBoundCase1 = isTargetVisible && !isOpen
                const outBoundCase2 = !isTargetVisible && !isOpen
                const outBoundCase3 = isTargetVisible && isOpen
                const outBoundCase4 = !isTargetVisible && isOpen

                if (outBoundCase1) {
                  const dPath = getPath(handleCoords(xRoot, yRoot, x2, y2, nodeWidth, nodeHeight))
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

                if (outBoundCase2) {
                  const { x: xRootOther, y: yRootOther } = graph.nodes[targetRootId!].position
                  const dPath = getPath(
                    handleCoords(xRoot, yRoot, xRootOther, yRootOther, nodeWidth, nodeHeight)
                  )
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

                if (outBoundCase3) {
                  const dPath = getPath(handleCoords(x1, y1, x2, y2, nodeWidth, nodeHeight))
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

                if (outBoundCase4) {
                  const { x: xRootOther, y: yRootOther } = graph.nodes[targetRootId!].position
                  const dPath = getPath(
                    handleCoords(x1, y1, xRootOther, yRootOther, nodeWidth, nodeHeight)
                  )
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
              }

              if (targetRootId) {
                const { x: xRoot, y: yRoot } = graph.nodes[targetRootId].position
                const isOpen = groups[targetGroupId!]
                const isEdgeOutbound = targetGroupId !== sourceGroupId
                if (!isEdgeOutbound) {
                  // Inbound edge
                  const [x2anim, y2anim] = isOpen ? [x2, y2] : [xRoot, yRoot]
                  const dPath = getPath(handleCoords(x1, y1, x2anim, y2anim, nodeWidth, nodeHeight))
                  return (
                    <ActualEdge
                      key={edge.id}
                      id={edge.id}
                      path={dPath}
                      isVisible={isOpen}
                      color={DEFAULT_EDGE_COLOR}
                    />
                  )
                }

                const isSourceVisible =
                  isEdgeOutbound &&
                  (sourceGroupId === undefined || (sourceGroupId && groups[sourceGroupId]))

                console.log(
                  graph.nodes[edge.source].data.label,
                  graph.nodes[edge.target].data.label
                )

                const outBoundCase1 = isSourceVisible && !isOpen
                const outBoundCase2 = !isSourceVisible && !isOpen
                const outBoundCase3 = isSourceVisible && isOpen
                const outBoundCase4 = !isSourceVisible && isOpen

                if (outBoundCase1) {
                  const dPath = getPath(handleCoords(x1, y1, xRoot, yRoot, nodeWidth, nodeHeight))
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

                if (outBoundCase2) {
                  const { x: xRootOther, y: yRootOther } = graph.nodes[sourceRootId!].position
                  const dPath = getPath(
                    handleCoords(xRootOther, yRootOther, xRoot, yRoot, nodeWidth, nodeHeight)
                  )
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

                if (outBoundCase3) {
                  const dPath = getPath(handleCoords(x1, y1, x2, y2, nodeWidth, nodeHeight))
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

                if (outBoundCase4) {
                  const { x: xRootOther, y: yRootOther } = graph.nodes[sourceRootId!].position
                  const dPath = getPath(
                    handleCoords(xRootOther, yRootOther, x2, y2, nodeWidth, nodeHeight)
                  )
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
              }

              //  Regular edge
              return (
                <ActualEdge
                  key={edge.id}
                  id={edge.id}
                  path={getPath(handleCoords(x1, y1, x2, y2, nodeWidth, nodeHeight))}
                  isVisible={true}
                  color={DEFAULT_EDGE_COLOR}
                />
              )
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

const getPath = ({ x1, y1, x2, y2 }: P): string => {
  const cx = x1 + (x2 - x1) / 2
  const path = `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`

  return path
}

interface P {
  x1: number
  y1: number
  x2: number
  y2: number
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
