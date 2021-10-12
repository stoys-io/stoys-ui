import { HIGHLIGHT_COLOR } from './constants'
import { Graph, Edge, Node, Badge, Table } from './model'

export const highlightNode = (id: string) => (graph: Graph) => ({
  ...graph,
  nodes: graph.nodes.map((node: Node) => {
    if (node.id !== id) {
      return node
    }

    return {
      ...node,
      data: {
        ...node.data,
        style: node.style?.color ? undefined : { color: HIGHLIGHT_COLOR },
      },
    }
  }),
})

export const resetHighlight = (graph: Graph): Graph => ({
  edges: graph.edges.map((edge: Edge) => ({
    ...edge,
    style: undefined,
  })),
  nodes: graph.nodes.map((node: Node) => ({
    ...node,
    data: { ...node.data, style: undefined },
  })),
})

export const changeBadge =
  (badge: Badge) =>
  (graph: Graph): Graph => ({
    ...graph,
    nodes: graph.nodes.map((node: Node) => ({
      ...node,
      data: {
        ...node.data,
        badge,
      },
    })),
  })

export const highlightNodesBatch = (ids: string[]) => (graph: Graph) => ({
  ...graph,
  nodes: graph.nodes.map((node: Node) => {
    if (!ids.includes(node.id)) {
      return {
        ...node,
        data: { ...node.data, style: undefined },
      }
    }

    return {
      ...node,
      data: { ...node.data, style: node.style?.color ? undefined : { color: HIGHLIGHT_COLOR } },
    }
  }),
})

export const highlightGraph = (edgesToHighlight: Edge[]) => (graph: Graph) => {
  const allTargetsAndSources = edgesToHighlight.reduce(
    (acc: string[], edge: Edge) => [...acc, edge.source, edge.target],
    []
  )
  const nodeIds = [...new Set(allTargetsAndSources)]

  return {
    edges: graph.edges.map((edge: Edge) => {
      if (!edgesToHighlight.find((hEdge: Edge) => hEdge.id === edge.id)) {
        return edge
      }

      return {
        ...edge,
        style: { stroke: HIGHLIGHT_COLOR },
      }
    }),
    nodes: graph.nodes.map((node: Node) => {
      if (!nodeIds.includes(node.id)) {
        return node
      }

      return {
        ...node,
        data: { ...node.data, style: node.style?.color ? undefined : { color: HIGHLIGHT_COLOR } },
      }
    }),
  }
}

export const findNeighborEdges = (graph: Graph, id: string): Edge[] => [
  ...graph.edges.filter(edge => edge.source === id),
  ...graph.edges.filter(edge => edge.target === id),
]

const findEdgeHelper = (
  edges: Edge[],
  head: Edge,
  queue: Edge[],
  visited: Edge[],
  isUpstream: boolean = false
): Edge[] => {
  if (!queue.length) {
    return visited
  }

  const matchEdges = (edge: Edge, head: Edge) =>
    isUpstream ? edge.target === head.source : edge.source === head.target

  const neighbors = edges.filter(
    edge => matchEdges(edge, head) && !visited.find(v => v.id === edge.id)
  )
  const newQueue = [...queue].slice(1).concat(neighbors)
  const newHead = newQueue[0]
  const newVisited =
    newHead && !visited.find(v => v.id === newHead.id) ? [...visited, newHead] : visited

  return findEdgeHelper(edges, newHead, newQueue, newVisited, isUpstream)
}

export const findUpstreamEdges = (graph: Graph, id: string): Edge[] => {
  const startEdges = graph.edges.filter(edge => edge.target === id)
  if (!startEdges.length) {
    return []
  }

  const visitedEdges = findEdgeHelper(graph.edges, startEdges[0], startEdges, [startEdges[0]], true)
  return visitedEdges
}

export const findDownstreamEdges = (graph: Graph, id: string) => {
  const startEdges = graph.edges.filter(edge => edge.source === id)
  if (!startEdges.length) {
    return []
  }

  const visitedEdges = findEdgeHelper(graph.edges, startEdges[0], startEdges, [startEdges[0]])
  return visitedEdges
}

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

export function collectChildColumnAndTableIds(
  tId: string,
  cId: string,
  edges: Array<Edge>,
  tables?: Array<Table>
): ColumnAndTableIds {
  let tableQueue = [tId]
  let columnsResult = [cId]
  let tableResult: Array<string | undefined> = []

  while (tableQueue.length) {
    const currentTableId = tableQueue.shift()

    tableResult.push(currentTableId)

    const currentTableColumnsDependencies = tables
      ?.find(table => table.id === currentTableId)
      ?.columns.filter(column => columnsResult.includes(column.id))
      .map(column => column.dependencies)
      .flat()
      .filter(notEmpty)
    columnsResult.push(...(currentTableColumnsDependencies ? currentTableColumnsDependencies : []))

    edges
      .filter(edge => edge.source === currentTableId)
      .forEach(edge => tableQueue.push(edge.target))
  }

  return {
    tableIds: tableResult.filter(id => id !== tId).filter(notEmpty),
    columnIds: columnsResult.filter(id => id !== cId),
  }
}

export function collectParentColumnAndTableIds(
  tId: string,
  cId: string,
  edges: Array<Edge>,
  tables?: Array<Table>
): ColumnAndTableIds {
  let tableQueue = [tId]
  let columnsResult = [cId]
  let tableResult: Array<string | undefined> = []

  while (tableQueue.length) {
    const currentTableId = tableQueue.shift()

    tableResult.push(currentTableId)

    const currentTableColumnsDependencies = tables
      ?.find(table => table.id === currentTableId)
      ?.columns.filter(column => columnsResult.some(cr => column.dependencies?.includes(cr)))
      .map(column => column.id)
      .filter(notEmpty)
    columnsResult.push(...(currentTableColumnsDependencies ? currentTableColumnsDependencies : []))

    edges
      .filter(edge => edge.target === currentTableId)
      .forEach(edge => tableQueue.push(edge.source))
  }

  return {
    tableIds: tableResult.filter(id => id !== tId).filter(notEmpty),
    columnIds: columnsResult.filter(id => id !== cId),
  }
}

export interface ColumnAndTableIds {
  tableIds: Array<string>
  columnIds: Array<string>
}
