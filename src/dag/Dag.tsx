import React, { useState } from 'react'
import ReactFlow, {
  ReactFlowProvider,
  Background,
  isNode,
  Node,
  Edge,
  MiniMap,
} from 'react-flow-renderer'
import { getLayoutedElements } from './layout'
import { DagNode } from './DagNode'
import { Wrap, Container, Content, Aside, Radio } from './styles'

import { edges as edgesMock } from './Edges.mock'
import { nodes as nodesMock } from './Nodes.mock'

interface MockData {
  edges: Array<{ id: string; source: string; target: string }>
  nodes: Array<{ id: string; label: string }>
}

const nodeControls = {
  onClick: () => console.log('Open drawer'),
}

const transformMockElements = ({ edges, nodes }: MockData): Graph => {
  const newEdges: Edge[] = edges.map(edge => ({ ...edge, id: `el-${edge.id}` }))
  const newNodes: Node[] = nodes.map(node => ({
    id: node.id,
    data: {
      label: node.label,
      highlight: false,
      controls: nodeControls,
    },
    position: initialPosition,
    type: 'dagNode',
  }))

  return { edges: newEdges, nodes: newNodes }
}

const Dag = ({ data }: Data) => {
  const initialNodes: Node<DataPayload>[] = data.tables.map((table: Table) => ({
    id: table.id,
    data: {
      label: table.name,
      controls: nodeControls,
      highlight: false,
    },
    position: initialPosition,
    type: 'dagNode',
  }))

  const initialEdges: Edge[] = data.tables
    .filter((t: Table) => t.dependencies !== undefined)
    .reduce((acc: Edge[], table: Table) => {
      const items = table.dependencies!.map(dep => ({
        id: `el-${dep}`,
        source: table.id,
        target: dep,
      }))

      return [...acc, ...items]
    }, [])

  const [graph, setGraph] = useState<Graph>({ nodes: initialNodes, edges: initialEdges })
  /* const [graph, setGraph] = useState<Graph>(
   *   transformMockElements({ nodes: nodesMock, edges: edgesMock })
   * ) */
  const [showWrap, setShowWrap] = useState<boolean>(false)

  const [highlightMode, setHighlightMode] = useState<string>('nearest')
  const onHighlightChange = (event: any) => {
    setGraph(resetHighlight)
    setHighlightMode(event.target.value)
  }

  const elements = getLayoutedElements([...graph.nodes, ...graph.edges])

  const onElementExpand = (event: React.MouseEvent<Element, MouseEvent>, element: Node | Edge) =>
    isNode(element) && setShowWrap(!showWrap)

  const highlightNode = (graph: Graph, id: string) => ({
    ...graph,
    nodes: graph.nodes.map((node: Node<DataPayload>) =>
      node.id !== id
        ? node
        : {
            ...node,
            data: { ...node.data, highlight: !node.data?.highlight ?? false },
          }
    ),
  })

  const highlightNodesBatch = (ids: string[]) => (graph: Graph) => ({
    ...graph,
    nodes: graph.nodes.map((node: Node<DataPayload>) =>
      !ids.includes(node.id)
        ? node
        : {
            ...node,
            data: { ...node.data, highlight: !node.data?.highlight ?? false },
          }
    ),
  })

  const resetHighlight = (graph: Graph) => ({
    ...graph,
    nodes: graph.nodes.map((node: Node<DataPayload>) => ({
      ...node,
      data: { ...node.data, highlight: false },
    })),
  })

  const onPaneClick = () => setGraph(resetHighlight)

  const findNeighbourNodes = (graph: Graph, id: string) => [
    ...graph.edges.filter(edge => edge.source === id).map(edge => edge.target),
    ...graph.edges.filter(edge => edge.target === id).map(edge => edge.source),
  ]

  const childNodesHelper = (
    edges: Edge[],
    head: string,
    queue: Edge[],
    visited: string[] = []
  ): string[] => {
    if (!queue.length) {
      return visited
    }

    const neighbors = edges.filter(edge => edge.source === head && !visited.includes(edge.target))
    const newQueue = [...queue].slice(1).concat(neighbors)
    const newHead = newQueue[0] && newQueue[0].target
    const newVisited =
      newQueue[0] && !visited.includes(newQueue[0].target)
        ? [...visited, newQueue[0].target]
        : visited

    return childNodesHelper(edges, newHead, newQueue, newVisited)
  }

  const findChildNodes = (graph: Graph, id: string) => {
    const startEdges = graph.edges.filter(edge => edge.source === id)
    const children = childNodesHelper(graph.edges, id, startEdges)

    return children
  }

  const parentNodesHelper = (
    edges: Edge[],
    head: string,
    queue: Edge[],
    visited: string[] = []
  ): string[] => {
    if (!queue.length) {
      return visited
    }

    const neighbors = edges.filter(edge => edge.target === head && !visited.includes(edge.source))
    const newQueue = [...queue].slice(1).concat(neighbors)
    const newHead = newQueue[0] && newQueue[0].source
    const newVisited =
      newQueue[0] && !visited.includes(newQueue[0].source)
        ? [...visited, newQueue[0].source]
        : visited

    return parentNodesHelper(edges, newHead, newQueue, newVisited)
  }

  const findParentNodes = (graph: Graph, id: string) => {
    const startEdges = graph.edges.filter(edge => edge.target === id)
    const children = parentNodesHelper(graph.edges, id, startEdges)

    return children
  }

  const onElementClick = (_: any, element: Node | Edge) => {
    if (!isNode(element)) {
      return
    }

    setGraph(resetHighlight)

    const nodesToHighlight =
      highlightMode === 'parents'
        ? findParentNodes(graph, element.id)
        : highlightMode === 'children'
        ? findChildNodes(graph, element.id)
        : findNeighbourNodes(graph, element.id)

    const nodesToHighlight2 = nodesToHighlight.concat([element.id])
    setGraph(highlightNodesBatch(nodesToHighlight2))
  }

  return (
    <ReactFlowProvider>
      <Container>
        <Aside>
          <MiniMap
            style={{ position: 'static' }}
            nodeColor={(node: Node) => {
              switch (node.type) {
                case 'input':
                  return 'red'
                case 'default':
                  return '#00ff00'
                case 'output':
                  return 'rgb(0,0,255)'
                default:
                  return '#eee'
              }
            }}
          />
          <Radio>
            <div>
              <input
                type="radio"
                id="nearest"
                value="nearest"
                onChange={onHighlightChange}
                checked={highlightMode === 'nearest'}
              />
              Nearest
            </div>
            <div>
              <input
                type="radio"
                id="parents"
                value="parents"
                onChange={onHighlightChange}
                checked={highlightMode === 'parents'}
              />
              Downstream (parents)
            </div>
            <div>
              <input
                type="radio"
                id="children"
                value="children"
                onChange={onHighlightChange}
                checked={highlightMode === 'children'}
              />
              Upstream (children)
            </div>
          </Radio>
        </Aside>
        <Content>
          <div style={{ height: '100vh', width: '100%' }}>
            <ReactFlow
              nodesDraggable={true}
              onElementClick={onElementClick}
              onNodeDoubleClick={onElementExpand}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              elements={elements}
            >
              <Background />
              {showWrap && <Wrap />}
            </ReactFlow>
          </div>
        </Content>
      </Container>
    </ReactFlowProvider>
  )
}

export { Dag }

const nodeTypes = {
  dagNode: DagNode,
}

const initialPosition = { x: 0, y: 0 }

interface Data {
  data: {
    tables: Table[]
  }
}

interface Table {
  id: string
  name: string
  dependencies?: string[]
}

interface DataPayload {
  highlight: boolean
  controls?: any
}

interface Graph {
  nodes: Node<DataPayload>[]
  edges: Edge[]
}
