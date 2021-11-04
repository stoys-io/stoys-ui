import { GraphStore, InitialArgs, StoredHighlights } from './model'
import { defaultHighlights, defaultHighlightedColumns } from './store'

import {
  highlightHighlight,
  collectParentColumnAndTableIds,
  collectChildColumnAndTableIds,
  notEmpty,
  resetHighlight,
  highlightNodesBatch,
} from '../graph-ops'
import { getBaseGraph, getMergedGraph } from '../GraphComponent'
import { Graph, Table, Column, ChromaticScale, Badge, Highlight, Node } from '../model'

export const setBadge = (badge: Badge) => ({ badge })
export const setInitialStore = ({ graph, data, tables }: InitialArgs) => ({
  graph,
  data,
  tables,
})

export const setBaseRelease =
  (baseRelease: string) =>
  ({ data, tables, graph }: GraphStore): Partial<GraphStore> => {
    if (baseRelease) {
      const baseGraph = getBaseGraph(baseRelease, data, tables)
      const mergedGraph = getMergedGraph(graph, baseGraph)
      const highlights = graphToHighlights(mergedGraph)

      return {
        baseRelease,
        highlightMode: 'diffing',
        highlights,
        graph: mergedGraph,
      }
    }

    return {}
  }

export const resetHighlightedColumns = { highlightedColumns: defaultHighlightedColumns }

export const resetHighlights = (state: GraphStore) =>
  state.highlightMode !== 'diffing' ? { highlights: defaultHighlights } : {}

export const setHighlightedColumns =
  (columnId: string, tableId: string) =>
  ({ graph, highlightMode, highlightedColumns, highlights: curHighlights, tables }: GraphStore) => {
    // Toggle columns
    if (columnId === highlightedColumns.selectedColumnId) {
      const newHighlights = resetHighlight(graph)
      return {
        highlightedColumns: defaultHighlightedColumns,
        highlights: graphToHighlights(newHighlights),
      }
    }

    return onHighlightModeChangeColumns({
      columnId,
      tableId,
      graph,
      highlights: curHighlights,
      highlightMode,
      tables,
    })
  }

export const nodeClick =
  (id: string, chromaticScale: ChromaticScale) =>
  ({ highlightMode, graph }: GraphStore) => {
    // ignode node click when diffing
    if (highlightMode === 'diffing') {
      return {
        highlightedColumns: defaultHighlightedColumns,
      }
    }

    if (highlightMode === 'none') {
      // Highlight single node
      const newHighlights = highlightNodesBatch([id])(resetHighlight(graph))

      return {
        highlights: graphToHighlights(newHighlights),
        selectedNodeId: id,
        highlightedColumns: defaultHighlightedColumns,
      }
    }

    const newHighlights = highlightHighlight(highlightMode)(graph, id, chromaticScale)
    return {
      highlights: graphToHighlights(newHighlights),
      selectedNodeId: id,
      highlightedColumns: defaultHighlightedColumns,
    }
  }

export const setDrawerTab = (drawerTab?: string) => ({ drawerTab })
export const openDrawer = (drawerNodeId: string) => ({ drawerNodeId })
export const closeDrawer = () => ({ drawerNodeId: undefined, drawerTab: undefined })

export const highlightIds =
  (ids: string[]) =>
  ({ graph }: GraphStore) => ({
    highlights: graphToHighlights(highlightNodesBatch(ids)(graph)),
  })

export const setHighlightMode =
  (highlightMode: Highlight, chromaticScale: ChromaticScale) =>
  ({
    graph,
    baseRelease,
    data,
    tables,
    selectedNodeId,
    highlights: curHighlights,
    highlightedColumns,
  }: GraphStore) => {
    if (highlightMode === 'diffing') {
      const baseGraph = getBaseGraph(baseRelease, data, tables)
      const mergedGraph = getMergedGraph(graph, baseGraph)
      const highlights = graphToHighlights(mergedGraph)

      return {
        highlightMode,
        highlights,
        graph: mergedGraph,
        highlightedColumns: defaultHighlightedColumns,
      }
    }

    const isInColumnContext = highlightedColumns.selectedColumnId !== ''
    if (isInColumnContext) {
      return {
        highlightMode,
        ...onHighlightModeChangeColumns({
          columnId: highlightedColumns.selectedColumnId,
          tableId: highlightedColumns.selectedTableId,
          graph,
          highlights: curHighlights,
          highlightMode,
          tables,
        }),
      }
    }

    if (highlightMode === 'none') {
      const newHighlights = resetHighlight(graph)

      return {
        highlightMode,
        highlights: graphToHighlights(newHighlights),
        selectedNodeId: undefined,
        highlightedColumns: defaultHighlightedColumns,
      }
    }

    if (!selectedNodeId) {
      return { highlightMode }
    }

    const newHighlights = highlightHighlight(highlightMode)(graph, selectedNodeId, chromaticScale)
    return {
      highlightMode,
      highlights: graphToHighlights(newHighlights),
      selectedNodeId,
    }
  }

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
