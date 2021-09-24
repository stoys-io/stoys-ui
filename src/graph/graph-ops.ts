import { Graph, Edge, Node, DataPayload, Badge } from './model2'

export const highlightNode = (id: string) => (graph: Graph) => ({
  ...graph,
  nodes: graph.nodes.map((node: Node) => {
    if (node.id !== id) {
      return node
    }

    const nodeData = node.data ?? defaultData
    return {
      ...node,
      data: { ...nodeData, highlight: !nodeData.highlight },
    }
  }),
})

export const highlightNodesBatch = (ids: string[]) => (graph: Graph) => ({
  ...graph,
  nodes: graph.nodes.map((node: Node) => {
    if (!ids.includes(node.id)) {
      return node
    }

    const nodeData = node.data ?? defaultData
    return {
      ...node,
      data: { ...nodeData, highlight: !nodeData.highlight },
    }
  }),
})

export const resetHighlight = (graph: Graph): Graph => ({
  ...graph,
  nodes: graph.nodes.map((node: Node) => {
    const nodeData = node.data ?? defaultData

    return {
      ...node,
      data: { ...nodeData, highlight: false },
    }
  }),
})

export const changeBadge =
  (badge: Badge) =>
  (graph: Graph): Graph => ({
    ...graph,
    nodes: graph.nodes.map((node: Node) => {
      const nodeData = node.data ?? defaultData
      return {
        ...node,
        data: {
          ...nodeData,
          badge,
        },
      }
    }),
  })

export const expandNode =
  (id: string) =>
  (graph: Graph): Graph => ({
    ...graph,
    nodes: graph.nodes.map((node: Node) => {
      if (node.id !== id) {
        return node
      }

      const nodeData = node.data ?? defaultData
      return {
        ...node,
        data: {
          ...nodeData,
          expand: !nodeData.expand,
        },
      }
    }),
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

const defaultData: DataPayload = {
  label: '',
  highlight: false,
  expand: false,
  badge: 'violations',
  partitions: 0,
  violations: 0,
}
