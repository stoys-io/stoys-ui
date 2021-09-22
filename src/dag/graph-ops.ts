import { Graph, Edge, Node } from './model'

export const highlightNode = (id: string) => (graph: Graph) => ({
  ...graph,
  nodes: graph.nodes.map((node: Node) =>
    node.id !== id
      ? node
      : {
          ...node,
          data: { ...node.data, highlight: !node.data?.highlight ?? false },
        }
  ),
})

export const highlightNodesBatch = (ids: string[]) => (graph: Graph) => ({
  ...graph,
  nodes: graph.nodes.map((node: Node) =>
    !ids.includes(node.id)
      ? node
      : {
          ...node,
          data: { ...node.data, highlight: !node.data?.highlight ?? false },
        }
  ),
})

export const resetHighlight = (graph: Graph) => ({
  ...graph,
  nodes: graph.nodes.map((node: Node) => ({
    ...node,
    data: { ...node.data, highlight: false },
  })),
})

export const findNeighborNodes = (graph: Graph, id: string) => [
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

export const findChildNodes = (graph: Graph, id: string) => {
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

export const findParentNodes = (graph: Graph, id: string) => {
  const startEdges = graph.edges.filter(edge => edge.target === id)
  const children = parentNodesHelper(graph.edges, id, startEdges)

  return children
}
