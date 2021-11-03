import create from 'zustand'
import { RESIZE_AREA_HEIGHT } from './constants'
import { getBaseGraph, getMergedGraph } from './GraphComponent'
import {
  highlightHighlight,
  collectParentColumnAndTableIds,
  collectChildColumnAndTableIds,
  notEmpty,
  resetHighlight,
  highlightNodesBatch,
} from './graph-ops'
import { ChromaticScale, Column, Node, Graph, DataGraph, Badge, Highlight, Table } from './model'

const defaultHighlightedColumns = {
  selectedTableId: '',
  selectedColumnId: '',
  relatedColumnsIds: [],
  relatedTablesIds: [],
}

const defaultDrawerHeight = 200
const defaultHighlights = { nodes: {}, edges: {} }
export const createStore = () =>
  create<GraphStore>((set, get) => ({
    graph: { nodes: [], edges: [] },

    highlightedColumns: defaultHighlightedColumns,
    resetHighlightedColumns: () =>
      set({
        highlightedColumns: defaultHighlightedColumns,
      }),
    setHighlightedColumns: (columnId: string, tableId: string) => {
      const graph = get().graph
      const highlightMode = get().highlightMode
      const highlightedColumns = get().highlightedColumns
      const curHighlights = get().highlights
      const tables = get().tables

      // Toggle columns
      if (columnId === highlightedColumns.selectedColumnId) {
        const newHighlights = resetHighlight(graph)
        return set({
          highlightedColumns: defaultHighlightedColumns,
          highlights: graphToHighlights(newHighlights),
        })
      }

      set(
        onHighlightModeChangeColumns({
          columnId,
          tableId,
          graph,
          highlights: curHighlights,
          highlightMode,
          tables,
        })
      )
    },

    data: [],
    tables: undefined,
    setInitialStore: ({ graph, data, tables }) => set({ graph, data, tables }),

    drawerHeight: defaultDrawerHeight,
    setDrawerHeight: (drawerHeight: number) => set({ drawerHeight }),

    drawerTab: undefined,
    setDrawerTab: (drawerTab?: string) => set({ drawerTab }),

    drawerNodeId: undefined,
    closeDrawer: () => set({ drawerNodeId: undefined, drawerTab: undefined }),
    hideDrawer: () => set({ drawerHeight: RESIZE_AREA_HEIGHT }),

    openDrawer: (drawerNodeId: string) =>
      get().drawerHeight === RESIZE_AREA_HEIGHT
        ? set({ drawerNodeId, drawerHeight: defaultDrawerHeight })
        : set({ drawerNodeId }),

    selectedNodeId: undefined,
    nodeClick: (id: string, chromaticScale: ChromaticScale) => {
      const highlightMode = get().highlightMode
      // ignode node click when diffing
      if (highlightMode === 'diffing') {
        return set({
          highlightedColumns: defaultHighlightedColumns,
        })
      }

      const graph = get().graph
      if (highlightMode === 'none') {
        // Highlight single node
        const newHighlights = highlightNodesBatch([id])(resetHighlight(graph))

        return set({
          highlights: graphToHighlights(newHighlights),
          selectedNodeId: id,
          highlightedColumns: defaultHighlightedColumns,
        })
      }

      const newHighlights = highlightHighlight(highlightMode)(graph, id, chromaticScale)
      return set({
        highlights: graphToHighlights(newHighlights),
        selectedNodeId: id,
        highlightedColumns: defaultHighlightedColumns,
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
      const baseRelease = get().baseRelease
      const data = get().data
      const tables = get().tables
      const selectedNodeId = get().selectedNodeId

      if (highlightMode === 'diffing') {
        const baseGraph = getBaseGraph(baseRelease, data, tables)
        const mergedGraph = getMergedGraph(graph, baseGraph)
        const highlights = graphToHighlights(mergedGraph)

        return set({
          highlightMode,
          highlights,
          graph: mergedGraph,
          highlightedColumns: defaultHighlightedColumns,
        })
      }

      const curHighlights = get().highlights
      const highlightedColumns = get().highlightedColumns
      const isInColumnContext = highlightedColumns.selectedColumnId !== ''
      if (isInColumnContext) {
        return set({
          highlightMode,
          ...onHighlightModeChangeColumns({
            columnId: highlightedColumns.selectedColumnId,
            tableId: highlightedColumns.selectedTableId,
            graph,
            highlights: curHighlights,
            highlightMode,
            tables,
          }),
        })
      }

      if (highlightMode === 'none') {
        const newHighlights = resetHighlight(graph)

        return set({
          highlightMode,
          highlights: graphToHighlights(newHighlights),
          selectedNodeId: undefined,
          highlightedColumns: defaultHighlightedColumns,
        })
      }

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

interface OnChangeModeColumnsArgs {
  columnId: string
  tableId: string
  highlights: StoredHighlights
  highlightMode: Highlight
  graph: Graph
  tables?: Table[]
}

const onHighlightModeChangeColumns = ({
  columnId,
  tableId,
  highlights,
  highlightMode,
  graph,
  tables,
}: OnChangeModeColumnsArgs) => {
  // TODO: Simplify. Columns and nodes search is basically the same thing.
  // ( `collectParentColumnAndTableIds`, `findEdgeHelper`)
  // No need to have a few functions to traverse the same graph
  if (highlightMode === 'none') {
    const newHighlights = resetHighlight(graph)
    return {
      highlightedColumns: defaultHighlightedColumns,
      highlights: graphToHighlights(newHighlights),
    }
  }

  if (highlightMode === 'diffing') {
    return {
      highlightedColumns: defaultHighlightedColumns,
      highlights,
    }
  }

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
    const tableAndColumnsIds = collectChildColumnAndTableIds(tableId, columnId, graph.edges, tables)

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

  const emptyColumns = (node: Node) => {
    const relatedColumns = node.data.columns.filter((column: Column) =>
      columnDependcies.includes(column.id)
    )
    return relatedColumns.length === 0
  }

  const emptyNodeIds = graph.nodes
    .filter(node => tableIds.includes(node.id) && emptyColumns(node))
    .map(node => node.id)

  // Remove all unrelated to columns nodes and edges
  const alteredGraph = {
    nodes: graph.nodes.filter(node => !emptyNodeIds.includes(node.id)),
    edges: graph.edges.filter(
      edge => !(emptyNodeIds.includes(edge.source) || emptyNodeIds.includes(edge.target))
    ),
  }

  const newHighlights = highlightHighlight(highlightMode)(alteredGraph, tableId)

  return {
    highlights: graphToHighlights(newHighlights),
    highlightedColumns: {
      selectedTableId: tableId,
      selectedColumnId: columnId,
      relatedColumnsIds: columnDependcies,
      relatedTablesIds: tableIds,
    },
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
  selectedTableId: string
  selectedColumnId: string
  relatedColumnsIds: Array<string>
  relatedTablesIds: Array<string>
}

interface StoredHighlights {
  nodes: StoredNodeStyle
  edges: StoredEdgeStyle
}

interface StoredNodeStyle {
  [key: string]: { color: string } | undefined
}

interface StoredEdgeStyle {
  [key: string]: EdgeStyle | undefined
}

interface EdgeStyle {
  stroke: string
  strokeWidth: string
}
