import React, { useState } from 'react'
import ReactFlow, { Background, isNode, Node, Edge } from 'react-flow-renderer'

import { edges as edgesMock } from './Edges.mock'
import { nodes as nodesMock } from './Nodes.mock'
import { getLayoutedElements } from './layout'

import { DagNode } from './DagNode'
import { Sidebar } from './Sidebar'
import { Wrap, Container, Content, Aside } from './styles'

const Dag = ({ data, enableGrouping = false }: Props) => {
  const initialNodes = !data
    ? initialMockNodes
    : !enableGrouping
    ? mapInitialNodes(data)
    : mapInitialNodesGrouping(data)

  const initialEdges = !data
    ? initialMockEdges
    : !enableGrouping
    ? mapInitialEdges(data)
    : mapInitialEdgesGrouping(data)

  const [graph, setGraph] = useState<Graph>({
    nodes: initialNodes,
    edges: initialEdges,
  })

  const [showWrap, _] = useState<boolean>(false)

  const [highlightMode, setHighlightMode] = useState<Highlight>('nearest')
  const onHighlightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGraph(resetHighlight)
    setHighlightMode(event.target.value as Highlight)
  }

  const elements = getLayoutedElements([...graph.nodes, ...graph.edges])

  const expandNode =
    (id: string) =>
    (graph: Graph): Graph => ({
      ...graph,
      nodes: graph.nodes.map((node: Node<DataPayload>) =>
        node.id !== id
          ? node
          : {
              ...node,
              data: {
                ...node.data,
                highlight: node.data?.highlight ?? false, // TODO: Remove this line
                expand: !node.data?.expand ?? false,
              },
            }
      ),
    })

  /* const onElementExpand = (event: React.MouseEvent<Element, MouseEvent>, element: Node | Edge) =>
   *   isNode(element) && setShowWrap(!showWrap) */

  const onElementExpand = (_: any, element: Node | Edge) =>
    isNode(element) && setGraph(expandNode(element.id))

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
    <Container>
      <Aside>
        <Sidebar highlight={highlightMode} onHighlightChange={onHighlightChange} />
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
  )
}

export { Dag }

interface Props {
  data: {
    tables: Table[]
  }
  enableGrouping: boolean
}

interface Table {
  id: string
  name: string
  dependencies?: string[]
  comboId?: string
}

interface DataPayload {
  highlight: boolean
  controls?: any
  expand?: boolean
}

interface Graph {
  nodes: Node<DataPayload>[]
  edges: Edge[]
}

type Highlight = 'nearest' | 'parents' | 'children'

const nodeTypes = {
  dagNode: DagNode,
}

const initialPosition = { x: 0, y: 0 }

const nodeControls = {
  onClick: () => console.log('Open drawer'),
}

const initialMockEdges: Edge[] = edgesMock.map(edge => ({ ...edge, id: `el-${edge.id}` }))
const initialMockNodes: Node[] = nodesMock.map(node => ({
  id: node.id,
  data: {
    label: node.label,
    highlight: false,
    controls: nodeControls,
  },
  position: initialPosition,
  type: 'dagNode',
}))

const mapInitialNodes = (data: Props['data']): Node<DataPayload>[] =>
  data.tables.map((table: Table) => ({
    id: table.id,
    data: {
      label: table.name,
      controls: nodeControls,
      highlight: false,
    },
    position: initialPosition,
    type: 'dagNode',
  }))

const mapInitialEdges = (data: Props['data']): Edge[] =>
  data.tables
    .filter((t: Table) => t.dependencies !== undefined)
    .reduce((acc: Edge[], table: Table) => {
      const items = table.dependencies!.map(dep => ({
        id: `el-${dep}`,
        source: table.id,
        target: dep,
      }))

      return [...acc, ...items]
    }, [])

const mapInitialNodesGrouping = (data: Props['data']): Node<DataPayload>[] => {
  const restNodes = data.tables
    .filter(table => !table.comboId)
    .map((table: Table) => ({
      id: table.id,
      data: {
        label: table.name,
        controls: nodeControls,
        highlight: false,
      },
      position: initialPosition,
      type: 'dagNode',
    }))

  const comb = data.tables.find(table => !!table.comboId)
  const comboNodeNode =
    comb !== undefined
      ? {
          id: comb.comboId!,
          data: {
            label: `combo ${comb.comboId}`,
            controls: nodeControls,
            highlight: false,
            expand: true,
          },
          position: initialPosition,
          type: 'dagNode',
        }
      : undefined

  return comboNodeNode ? restNodes.concat(comboNodeNode) : restNodes
}

const mapInitialEdgesGrouping = (data: Props['data']): Edge[] =>
  data.tables
    .filter((t: Table) => t.dependencies !== undefined)
    .reduce((acc: Edge[], table: Table) => {
      const items = table.dependencies!.map(dep => ({
        id: `el-${dep}`,
        source: table.id,
        target: dep,
      }))

      return [...acc, ...items]
    }, [])
