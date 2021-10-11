import { HIGHLIGHT_COLOR } from './constants'
import { Graph, Edge, Node, Badge, Table, ChromaticScale, Highlight } from './model'
import { fromColorPallete } from './color-helpers'

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

export const highlightGraph =
  (
    nodeId: string,
    edgesToHighlight: Edge[],
    highlight: Highlight,
    maxRank: number,
    chromaticScale?: ChromaticScale // TODO: Should chromaticScale be configurable or always present?
  ) =>
  (graph: Graph) => {
    const getColor = chromaticScale
      ? fromColorPallete(maxRank, highlight, chromaticScale)
      : (_: any) => HIGHLIGHT_COLOR

    return {
      edges: graph.edges.map((edge: Edge) => {
        const highlightEdge = edgesToHighlight.find((hEdge: Edge) => hEdge.id === edge.id)
        if (!highlightEdge) {
          return {
            ...edge,
            style: { strokeWidth: 0 }, // Hide other edges
          }
        }

        return {
          ...highlightEdge,
          style: { stroke: getColor(highlightEdge.data.rank), strokeWidth: '2px' },
        }
      }),
      nodes: graph.nodes.map((node: Node) => {
        const relevantEdge = edgesToHighlight.find(
          edge => edge.source === node.id || edge.target === node.id
        )
        if (!relevantEdge) {
          return node
        }

        return {
          ...node,
          data: {
            ...node.data,
            style: node.style?.color ? undefined : { color: getColor(relevantEdge.data.rank) },
          },
        }
      }),
    }
  }

interface EdgesData {
  edges: Edge[]
  maxRank: number
}

export const findNeighborEdges = (graph: Graph, id: string): EdgesData => ({
  edges: [
    ...graph.edges.filter(edge => edge.source === id).map(edge => ({ ...edge, data: { rank: 1 } })),

    ...graph.edges
      .filter(edge => edge.target === id)
      .map(edge => ({ ...edge, data: { rank: -1 } })),
  ],
  maxRank: 0, // dummy value
})

const findEdgeHelper = (
  edges: Edge[],
  head: Edge,
  queue: Edge[],
  visited: Edge[],
  rank: number,
  isUpstream: boolean = false
): EdgesData => {
  if (!queue.length) {
    // console.log({ edges: visited, maxRank: rank })
    return { edges: visited, maxRank: rank }
  }

  const matchEdges = (edge: Edge, head: Edge) =>
    isUpstream ? edge.target === head.source : edge.source === head.target

  const neighbors = edges.filter(
    edge => matchEdges(edge, head) && !visited.find(v => v.id === edge.id)
  )

  const newRank = rank + 1
  const rankedNeighbors = !neighbors.length
    ? neighbors
    : neighbors.map(edge => ({ ...edge, data: { rank: newRank } }))

  const newQueue = [...queue].slice(1).concat(rankedNeighbors)
  const newHead = newQueue[0]
  const newVisited =
    newHead && !visited.find(v => v.id === newHead.id) ? [...visited, newHead] : visited

  return findEdgeHelper(edges, newHead, newQueue, newVisited, newRank, isUpstream)
}

export const findUpstreamEdges = (graph: Graph, id: string): EdgesData => {
  const startEdges = graph.edges.filter(edge => edge.target === id)
  if (!startEdges.length) {
    return { edges: [], maxRank: 1 }
  }

  const initialMaxRank = 1
  const visitedEdges = findEdgeHelper(
    graph.edges,
    startEdges[0],
    startEdges,
    [startEdges[0]],
    initialMaxRank,
    true
  )
  return visitedEdges
}

export const findDownstreamEdges = (graph: Graph, id: string): EdgesData => {
  const startEdges = graph.edges.filter(edge => edge.source === id)
  if (!startEdges.length) {
    return { edges: [], maxRank: 1 }
  }
  const initialMaxRank = 1
  const visitedEdges = findEdgeHelper(
    graph.edges,
    startEdges[0],
    startEdges,
    [startEdges[0]],
    initialMaxRank
  )
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
