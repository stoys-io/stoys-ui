import create from 'zustand'
import { Graph } from './model'

interface GraphStore {
  highlights: StoredHighlights
  setHighlights: (_: Graph) => void
}

interface StoredHighlights {
  nodes: StoredNodeStyle
  edges: StoredEdgeStyle
}

interface StoredNodeStyle {
  [key: string]: { color: string } | undefined
}

interface StoredEdgeStyle {
  [key: string]:
    | {
        stroke: string
        strokeWidth: string
      }
    | undefined
}

export const useGraphStore = create<GraphStore>(set => ({
  highlights: { nodes: {}, edges: {} },
  setHighlights: (hGraph: Graph) => {
    const nodesTmpRefactoring = hGraph.nodes.reduce(
      (acc, node) => ({
        ...acc,
        [node.id]: node.data.style,
      }),
      {}
    )

    const edgesTmpRefactoring = hGraph.edges.reduce(
      (acc, edge) => ({
        ...acc,
        [edge.id]: edge.style,
      }),
      {}
    )

    set((state: GraphStore) => ({
      ...state,
      highlights: {
        nodes: nodesTmpRefactoring,
        edges: edgesTmpRefactoring,
      },
    }))
  },
}))
