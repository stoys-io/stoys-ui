import create from 'zustand'
import { RESIZE_AREA_HIGHT } from './constants'
import { getBaseGraph, getMergedGraph } from './Graph'
import {
  highlightHighlight,
  collectParentColumnAndTableIds,
  collectChildColumnAndTableIds,
  notEmpty,
  resetHighlight,
  highlightNodesBatch,
} from './graph-ops'
import { ChromaticScale, Graph, DataGraph, Badge, Highlight, Table } from './model'

const defaultHighlightedColumns = {
  selectedTableId: '',
  selectedColumnId: '',
  reletedColumnsIds: [],
  reletedTablesIds: [],
  highlightedType: 'nearest' as 'nearest',
}

const defaultHighlights = { nodes: {}, edges: {} }
const defaultDrawerHeight = 500
export const useGraphStore = create<GraphStore>((set, get) => ({
  graph: { nodes: [], edges: [] },

  highlightedColumns: defaultHighlightedColumns,
  resetHighlightedColumns: () =>
    set({
      highlightedColumns: defaultHighlightedColumns,
    }),
  setHighlightedColumns: (columnId: string, tableId: string) => {
    const highlightedColumns = get().highlightedColumns
    const tables = get().tables

    if (columnId === highlightedColumns.selectedColumnId) {
      return set({ highlightedColumns: defaultHighlightedColumns })
    }

    const graph = get().graph
    const highlightMode = get().highlightMode

    let tableIds: Array<string> = []
    let columnDependcies: Array<string> = []

    if (highlightMode === 'parents') {
      const tableAndColumnsIds = collectParentColumnAndTableIds(
        tableId,
        columnId,
        graph.edges,
        tables
      )

      tableIds = tableAndColumnsIds.tableIds
      columnDependcies = tableAndColumnsIds.columnIds
    } else if (highlightMode === 'children') {
      const tableAndColumnsIds = collectChildColumnAndTableIds(
        tableId,
        columnId,
        graph.edges,
        tables
      )

      tableIds = tableAndColumnsIds.tableIds
      columnDependcies = tableAndColumnsIds.columnIds
    } else {
      tableIds = [
        ...graph.edges.filter(edge => edge.source === tableId).map(edge => edge.target),
        ...graph.edges.filter(edge => edge.target === tableId).map(edge => edge.source),
      ]
      const tableColumnIds = tables
        ?.filter(table => tableIds.includes(table.id))
        .map(table => table.columns.find(column => column.dependencies?.includes(columnId))?.id)
      const selectedColumnDependcies = tables
        ?.find(table => table.id === tableId)
        ?.columns.find(column => column.id === columnId)?.dependencies
      columnDependcies = [
        ...(tableColumnIds ? tableColumnIds : []),
        ...(selectedColumnDependcies ? selectedColumnDependcies : []),
      ].filter(notEmpty)
    }

    return set({
      highlightedColumns: {
        selectedTableId: tableId,
        selectedColumnId: columnId,
        reletedColumnsIds: columnDependcies,
        reletedTablesIds: tableIds,
        highlightedType: highlightMode,
      },
    })
  },

  data: [],
  tables: undefined,
  setInitialStore: ({ graph, data, tables }) => set({ graph, data, tables }),

  drawerHeight: defaultDrawerHeight,
  getDrawerHeight: () => get().drawerHeight,
  setDrawerHeight: (drawerHeight: number) => set({ drawerHeight }),

  drawerTab: undefined,
  setDrawerTab: (drawerTab?: string) => set({ drawerTab }),

  drawerNodeId: undefined,
  closeDrawer: () => set({ drawerNodeId: undefined, drawerTab: undefined }),
  hideDrawer: () => set({ drawerHeight: RESIZE_AREA_HIGHT }),

  openDrawer: (drawerNodeId: string) =>
    get().drawerHeight === RESIZE_AREA_HIGHT
      ? set({ drawerNodeId, drawerHeight: defaultDrawerHeight })
      : set({ drawerNodeId }),

  selectedNodeId: undefined,
  nodeClick: (id: string, chromaticScale: ChromaticScale) => {
    const highlightMode = get().highlightMode
    // ignode node click when diffing
    if (highlightMode === 'diffing') {
      return
    }

    const graph = get().graph
    if (highlightMode === 'none') {
      // Highlight single node
      const newHighlights = highlightNodesBatch([id])(resetHighlight(graph))

      return set({
        highlights: graphToHighlights(newHighlights),
        selectedNodeId: id,
      })
    }

    const newHighlights = highlightHighlight(highlightMode)(graph, id, chromaticScale)
    return set({
      highlights: graphToHighlights(newHighlights),
      selectedNodeId: id,
    })
  },

  searchNodeLabels: (value: string): string[] => {
    const graph = get().graph
    return graph.nodes
      .filter(node => node.data?.label.indexOf(value.toLowerCase()) !== -1)
      .map(node => node.id)
  },

  baseRelease: '',
  setBaseRelease: (baseRelease: string) => {
    if (baseRelease) {
      const data = get().data
      const tables = get().tables
      const graph = get().graph

      const baseGraph = getBaseGraph(baseRelease, data, tables)
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
  setHighlightMode: (highlightMode: Highlight, chromaticScale: ChromaticScale) => {
    const graph = get().graph
    if (highlightMode === 'none') {
      const newHighlights = resetHighlight(graph)

      return set({
        highlightMode,
        highlights: graphToHighlights(newHighlights),
        selectedNodeId: undefined,
      })
    }

    if (highlightMode === 'diffing') {
      // TODO: This block possibly does not belong here
      const baseRelease = get().baseRelease
      const data = get().data
      const tables = get().tables

      const baseGraph = getBaseGraph(baseRelease, data, tables)
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

    const newHighlights = highlightHighlight(highlightMode)(graph, selectedNodeId, chromaticScale)
    return set({
      highlightMode,
      highlights: graphToHighlights(newHighlights),
      selectedNodeId,
    })
  },

  highlights: defaultHighlights,
  setHighlights: (fn: (g: Graph) => Graph) =>
    set(state => ({
      highlights: graphToHighlights(fn(state.graph)),
    })),

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

export interface GraphStore {
  graph: Graph

  highlightedColumns: HColumns
  resetHighlightedColumns: () => void
  setHighlightedColumns: (columnId: string, tableId: string) => void

  data: DataGraph[]
  tables?: Table[]

  drawerNodeId?: string
  drawerHeight: number
  getDrawerHeight: () => number
  setDrawerHeight: (_: number) => void
  drawerTab?: string
  setDrawerTab: (_?: string) => void
  closeDrawer: () => void
  hideDrawer: () => void
  openDrawer: (id: string) => void

  setInitialStore: (arg: InitialArgs) => void

  selectedNodeId?: string
  nodeClick: (id: string, chromaticScale: ChromaticScale) => void
  searchNodeLabels: (value: string) => string[]

  baseRelease: string
  setBaseRelease: (_: string) => void

  badge: Badge
  setBadge: (_: Badge) => void

  highlights: StoredHighlights
  setHighlights: (fn: (_: Graph) => Graph) => void
  resetHighlights: () => void

  highlightMode: Highlight
  setHighlightMode: (value: Highlight, chromaticScale: ChromaticScale) => void
}

interface InitialArgs {
  graph: Graph
  data: DataGraph[]
  tables?: Table[]
}

interface HColumns {
  highlightedType: Highlight
  selectedTableId: string
  selectedColumnId: string
  reletedColumnsIds: Array<string>
  reletedTablesIds: Array<string>
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
