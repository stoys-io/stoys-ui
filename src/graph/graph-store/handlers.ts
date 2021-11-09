import { GraphStore, InitialArgs } from './model'
import { defaultHighlights, defaultHighlightedColumns } from './store'

import {
  highlightGraph,
  collectParentColumnAndTableIds,
  collectChildColumnAndTableIds,
  notEmpty,
  highlightNodesBatch,
  getBaseGraph,
  getMergedGraph,
  highlightSingleNode,
  highlightMetrics,
} from '../graph-ops'
import { Graph, Table, Column, ChromaticScale, Badge, Highlight, Highlights, Node } from '../model'

export const setBadge =
  (badge: Badge) =>
  ({ defaultGraph }: GraphStore): Partial<GraphStore> => {
    const newHighlightMode = 'metrics'
    const highlights = highlightMetrics({ metric: badge, graph: defaultGraph })
    return {
      badge,
      highlights,
      highlightMode: newHighlightMode,
      graph: defaultGraph,
    }
  }

export const setInitialStore = ({ graph, data, tables }: InitialArgs) => ({
  graph,
  defaultGraph: graph,
  data,
  tables,
})

export const setBaseRelease =
  (baseRelease: string) =>
  ({ data, tables, graph, highlightedColumns }: GraphStore): Partial<GraphStore> => {
    if (baseRelease) {
      const baseGraph = getBaseGraph(baseRelease, data, tables)
      const { graph: mergedGraph, highlights } = baseGraph
        ? getMergedGraph(graph, baseGraph)
        : getMergedGraph(graph, graph)

      return {
        baseRelease,
        highlightMode: 'diffing',
        graph: mergedGraph,
        ...onHighlightModeChangeColumns({
          columnId: highlightedColumns.selectedColumnId,
          tableId: highlightedColumns.selectedTableId,
          graph: mergedGraph,
          highlights,
          highlightMode: 'diffing',
          tables,
        }),
      }
    }

    return {}
  }

export const resetHighlightedColumns = { highlightedColumns: defaultHighlightedColumns }

export const resetHighlights = ({ highlightMode }: GraphStore) =>
  ['diffing', 'metrics'].includes(highlightMode) ? { highlights: defaultHighlights } : {}

export const setHighlightedColumns =
  (columnId: string, tableId: string) =>
  ({
    defaultGraph,
    highlightMode,
    highlightedColumns,
    highlights: curHighlights,
    tables,
  }: GraphStore) => {
    // Toggle columns
    if (columnId === highlightedColumns.selectedColumnId) {
      return {
        highlightedColumns: defaultHighlightedColumns,
        highlights: defaultHighlights,
      }
    }

    return onHighlightModeChangeColumns({
      columnId,
      tableId,
      graph: defaultGraph,
      highlights: curHighlights,
      highlightMode,
      tables,
    })
  }

export const nodeClick =
  (id: string, chromaticScale: ChromaticScale) =>
  ({ highlightMode, defaultGraph }: GraphStore) => {
    // ignode node click when diffing
    if (highlightMode === 'diffing' || highlightMode === 'metrics') {
      return {
        highlightedColumns: defaultHighlightedColumns,
      }
    }

    if (highlightMode === 'none') {
      // Highlight single node
      const newHighlights = highlightSingleNode(id)

      return {
        highlights: newHighlights,
        selectedNodeId: id,
        highlightedColumns: defaultHighlightedColumns,
      }
    }

    const newHighlights = highlightGraph(highlightMode, defaultGraph, id, chromaticScale)
    return {
      highlights: newHighlights,
      selectedNodeId: id,
      highlightedColumns: defaultHighlightedColumns,
    }
  }

export const setDrawerTab = (drawerTab?: string) => ({ drawerTab })
export const openDrawer = (drawerNodeId: string) => ({ drawerNodeId })
export const closeDrawer = () => ({ drawerNodeId: undefined, drawerTab: undefined })

export const highlightIds = (ids: string[]) => ({
  highlights: highlightNodesBatch(ids),
})

export const setHighlightMode =
  (highlightMode: Highlight, chromaticScale: ChromaticScale) =>
  ({
    graph,
    defaultGraph,
    baseRelease,
    data,
    badge,
    tables,
    selectedNodeId,
    highlights: curHighlights,
    highlightedColumns,
  }: GraphStore) => {
    if (highlightMode === 'diffing') {
      const baseGraph = getBaseGraph(baseRelease, data, tables)
      const { graph: mergedGraph, highlights } = baseGraph
        ? getMergedGraph(graph, baseGraph)
        : getMergedGraph(graph, graph)

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
          graph: defaultGraph,
          highlights: curHighlights,
          highlightMode,
          tables,
        }),
      }
    }

    if (highlightMode === 'none') {
      return {
        highlightMode,
        highlights: defaultHighlights,
        selectedNodeId: undefined,
        highlightedColumns: defaultHighlightedColumns,
        graph: defaultGraph,
      }
    }

    if (highlightMode === 'metrics') {
      return {
        highlightMode,
        highlights: highlightMetrics({ metric: badge, graph }),
        selectedNodeId: undefined,
        highlightedColumns: defaultHighlightedColumns,
        graph: defaultGraph,
      }
    }

    if (!selectedNodeId) {
      return {
        highlightMode,
        highlights: defaultHighlights,
        graph: defaultGraph,
        highlightedColumns: defaultHighlightedColumns,
      }
    }

    const newHighlights = highlightGraph(
      highlightMode,
      defaultGraph,
      selectedNodeId,
      chromaticScale
    )

    return {
      highlightMode,
      highlights: newHighlights,
      graph: defaultGraph,
      highlightedColumns: defaultHighlightedColumns,
      selectedNodeId,
    }
  }

interface OnChangeModeColumnsArgs {
  columnId: string
  tableId: string
  highlights: Highlights
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
    return {
      highlightedColumns: defaultHighlightedColumns,
      highlights: defaultHighlights,
    }
  }

  if (highlightMode === 'diffing' || highlightMode === 'metrics') {
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
    release: graph.release,
  }

  const newHighlights = highlightGraph(highlightMode, alteredGraph, tableId)

  return {
    highlights: newHighlights,
    highlightedColumns: {
      selectedTableId: tableId,
      selectedColumnId: columnId,
      relatedColumnsIds: columnDependcies,
      relatedTablesIds: tableIds,
    },
  }
}
