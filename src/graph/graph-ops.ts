import { HIGHLIGHT_COLOR } from './constants'
import { Graph, Edge, Node, Badge, Table, ChromaticScale, Highlight } from './model'

import * as d3ScaleChromatic from 'd3-scale-chromatic'

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
    edgesToHighlight: Edge[],
    highlight: Highlight,
    maxRank: number,
    chromaticScale?: ChromaticScale
  ) =>
  (graph: Graph) => {
    // const allTargetsAndSources = edgesToHighlight.reduce(
    //   (acc: string[], edge: Edge) => [...acc, edge.source, edge.target],
    //   []
    // )
    // const nodeIds = [...new Set(allTargetsAndSources)]
    const getColor = chromaticScale
      ? fromColorPallete(maxRank, highlight, chromaticScale)
      : (_: any) => HIGHLIGHT_COLOR

    return {
      edges: graph.edges.map((edge: Edge) => {
        if (!edgesToHighlight.find((hEdge: Edge) => hEdge.id === edge.id)) {
          return edge
        }

        return {
          ...edge,
          style: { stroke: getColor(edge.data.rank) },
        }
      }),
      nodes: graph.nodes.map((node: Node) => {
        const thatEdge = edgesToHighlight.find(
          edge => edge.source === node.id || edge.target === node.id
        )
        if (!thatEdge) {
          return node
        }

        return {
          ...node,
          data: {
            ...node.data,
            style: node.style?.color ? undefined : { color: getColor(thatEdge.data.rank) },
          },
        }
      }),
    }
  }

interface Stuff {
  edges: Edge[]
  maxRank: number
}

export const findNeighborEdges = (graph: Graph, id: string): Stuff => ({
  edges: [
    ...graph.edges.filter(edge => edge.source === id),
    ...graph.edges.filter(edge => edge.target === id),
  ],
  maxRank: 2,
})

const findEdgeHelper = (
  edges: Edge[],
  head: Edge,
  queue: Edge[],
  visited: Edge[],
  rank: number,
  isUpstream: boolean = false
): Stuff => {
  if (!queue.length) {
    return { edges: visited, maxRank: rank }
  }

  const matchEdges = (edge: Edge, head: Edge) =>
    isUpstream ? edge.target === head.source : edge.source === head.target

  const newRank = rank + 1
  const neighbors = edges
    .filter(edge => matchEdges(edge, head) && !visited.find(v => v.id === edge.id))
    .map(edge => ({ ...edge, data: { rank: newRank } }))

  const newQueue = [...queue].slice(1).concat(neighbors)
  const newHead = newQueue[0]
  const newVisited =
    newHead && !visited.find(v => v.id === newHead.id) ? [...visited, newHead] : visited

  return findEdgeHelper(edges, newHead, newQueue, newVisited, newRank, isUpstream)
}

export const findUpstreamEdges = (graph: Graph, id: string): Stuff => {
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

export const findDownstreamEdges = (graph: Graph, id: string): Stuff => {
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

const fromColorPallete =
  (maxRank: number, highlight: Highlight, chromaticScale: ChromaticScale) => (rank: number) => {
    const gradient = getDepthGradientParams(maxRank, highlight)

    return getChromaticColor(gradient[rank], chromaticScale)
  }

const getChromaticColor = (t: number, chromaticScale: ChromaticScale) => {
  const scale = d3ScaleChromatic[chromaticScale]
  return scale(t)
}

const getDepthGradientParams = (maxRank: number, highlight: Highlight) => {
  let lowParam = 0
  let highParam = 0.25

  if (highlight === 'parents') {
    lowParam = 0.75
    highParam = 1
  }

  let remainDiff = highParam - lowParam

  const depthGradientParams: { [key: number]: number } = {}
  for (let i = 1; i < maxRank; i++) {
    if (i === 1) {
      depthGradientParams[i] = highlight === 'parents' ? lowParam : highParam
    } else {
      depthGradientParams[i] =
        highlight === 'parents'
          ? depthGradientParams[i - 1] + remainDiff / 2
          : depthGradientParams[i - 1] - remainDiff / 2
      remainDiff = remainDiff / 2
    }
  }

  depthGradientParams[maxRank] = highlight === 'parents' ? highParam : lowParam

  return depthGradientParams
}
