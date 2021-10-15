import create from 'zustand'
import { highlightHighlight } from './graph-ops'
import { ChromaticScale, Graph, Highlight } from './model'

interface GraphStore {
  highlightMode: Highlight
  setHighlightMode: (_: Highlight) => void
  highlightHandler: (graph: Graph, id: string, chromaticScale: ChromaticScale) => void
  nodeClick: (graph: Graph, id: string, chromaticScale: ChromaticScale) => void

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

export const useGraphStore = create<GraphStore>((set, get) => ({
  highlightMode: 'nearest',
  highlightHandler: () => {},
  setHighlightMode: (highlightMode: Highlight) =>
    set({
      highlightMode,
      highlightHandler: (graph: Graph, id: string, chromaticScale: ChromaticScale) =>
        get().setHighlights(highlightHighlight(highlightMode)(graph, id, chromaticScale)),
    }),

  nodeClick: (graph: Graph, id: string, chromaticScale: ChromaticScale) =>
    get().highlightHandler(graph, id, chromaticScale),

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

    set({
      highlights: {
        nodes: nodesTmpRefactoring,
        edges: edgesTmpRefactoring,
      },
    })
  },
}))
