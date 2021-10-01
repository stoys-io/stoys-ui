import { HIGHLIGHT_COLOR } from './constants'
import { Graph, Edge, Node, Badge } from './model'

export const highlightNode = (id: string) => (graph: Graph) => ({
  ...graph,
  nodes: graph.nodes.map((node: Node) => {
    if (node.id !== id) {
      return node
    }

    return {
      ...node,
      data: { ...node.data, highlight: !node.data.highlight },
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
    data: { ...node.data, highlight: false },
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
        data: { ...node.data, highlight: !node.data.highlight },
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

  const cmp = (edge: Edge, head: Edge) =>
    isUpstream ? edge.target === head.source : edge.source === head.target

  const neighbors = edges.filter(edge => cmp(edge, head) && !visited.find(v => v.id === edge.id))
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
