import create from 'zustand'
import { DataGraph, getBaseGraph, getMergedGraph } from './Graph'
import { highlightHighlight } from './graph-ops'
import { ChromaticScale, Graph, Badge, Highlight, Table } from './model'

interface GraphStore {
  graph: Graph
  getCurrentGraph: () => Graph

  data: DataGraph[]
  tables?: Table[]
  openDrawer: any // TODO: Remove
  setInitialStore: (arg: InitialArgs) => void

  chromaticScale: ChromaticScale

  selectedNodeId?: string
  nodeClick: (graph: Graph, id: string, chromaticScale: ChromaticScale) => void

  baseRelease: string
  setBaseRelease: (_: string) => void

  badge: Badge
  setBadge: (_: Badge) => void

  highlights: StoredHighlights
  setHighlights: (_: Graph) => void
  resetHighlights: () => void

  highlightMode: Highlight
  getHighlightMode: () => Highlight
  setHighlightMode: (_: Highlight) => void
}

interface InitialArgs {
  graph: Graph
  data: DataGraph[]
  tables?: Table[]
  openDrawer: any // TODO: Remove
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
  getCurrentGraph: () => get().graph,

  data: [],
  tables: undefined,
  openDrawer: () => {},
  setInitialStore: ({ graph, data, tables, openDrawer }) =>
    set({ graph, data, tables, openDrawer }),

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

  baseRelease: '',
  setBaseRelease: (baseRelease: string) => {
    if (baseRelease) {
      const openDrawer = get().openDrawer
      const data = get().data
      const tables = get().tables
      const graph = get().graph

      const baseGraph = getBaseGraph(baseRelease, openDrawer, data, tables)
      const mergedGraph = getMergedGraph(graph, baseGraph)
      const highlights = graphToHighlights(mergedGraph)

      return set({
        baseRelease,
        highlightMode: 'diffing',
        highlights,
        graph: mergedGraph,
      })
    }
  },

  badge: 'violations',
  setBadge: (badge: Badge) => set({ badge }),

  highlightMode: 'nearest',
  getHighlightMode: () => get().highlightMode,
  setHighlightMode: (highlightMode: Highlight) => {
    if (highlightMode === 'diffing') {
      // TODO: This block possibly does not belong here
      const baseRelease = get().baseRelease
      const openDrawer = get().openDrawer
      const data = get().data
      const tables = get().tables
      const graph = get().graph

      const baseGraph = getBaseGraph(baseRelease, openDrawer, data, tables)
      const mergedGraph = getMergedGraph(graph, baseGraph)
      const highlights = graphToHighlights(mergedGraph)

      return set({
        highlightMode,
        highlights,
        graph: mergedGraph,
      })
    }

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
