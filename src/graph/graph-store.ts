import create from 'zustand'
import { highlightHighlight } from './graph-ops'
import { ChromaticScale, Graph, Highlight } from './model'

interface GraphStore {
  graph: Graph
  chromaticScale: ChromaticScale

  highlights: StoredHighlights
  setHighlights: (_: Graph) => void
  resetHighlights: () => void

  highlightMode: Highlight
  setHighlightMode: (_: Highlight) => void

  selectedNodeId?: string
  nodeClick: (graph: Graph, id: string, chromaticScale: ChromaticScale) => void
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

const defaultHighlights = { nodes: {}, edges: {} }
export const useGraphStore = create<GraphStore>((set, get) => ({
  graph: { nodes: [], edges: [] },
  chromaticScale: 'interpolatePuOr',

  selectedNodeId: undefined,
  nodeClick: (graph: Graph, id: string, chromaticScale: ChromaticScale) => {
    const highlightMode = get().highlightMode
    const newHighlights = highlightHighlight(highlightMode)(graph, id, chromaticScale)
    return set({
      highlights: graphToHighlights(newHighlights),
      graph,
      chromaticScale,
      selectedNodeId: id,
    })
  },

  highlightMode: 'nearest',
  setHighlightMode: (highlightMode: Highlight) => {
    const selectedNodeId = get().selectedNodeId
    if (!selectedNodeId) {
      return set({ highlightMode })
    }

    const graph = get().graph
    const chromaticScale = get().chromaticScale
    const newHighlights = highlightHighlight(highlightMode)(graph, selectedNodeId, chromaticScale)
    return set({
      highlightMode,
      highlights: graphToHighlights(newHighlights),
      graph,
      chromaticScale,
      selectedNodeId,
    })
  },

  highlights: defaultHighlights,
  setHighlights: (graph: Graph) => set({ highlights: graphToHighlights(graph) }),
  resetHighlights: () =>
    get().highlightMode !== 'diffing' &&
    set({
      highlights: defaultHighlights,
    }),
}))

const graphToHighlights = (hGraph: Graph): StoredHighlights => {
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

  return {
    nodes: nodesTmpRefactoring,
    edges: edgesTmpRefactoring,
  }
}
