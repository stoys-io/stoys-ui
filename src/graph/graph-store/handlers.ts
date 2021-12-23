import { GraphStore, InitialArgs } from './model'
import { defaultHighlights, defaultHighlightedColumns } from './store'

import {
  highlightGraph,
  highlightNodesBatch,
  getBaseGraph,
  getMergedGraph,
  highlightSingleNode,
  highlightMetrics,
  highlightColumnMetrics,
} from '../graph-ops'

import { traverseGraph, Traversable } from '../graph-traversal'

import {
  Graph,
  Table,
  ChromaticScale,
  Highlight,
  Highlights,
  TableMetric,
  ColumnMetric,
  Edge,
} from '../model'

export const setCountNormalize = (countNormalize: boolean) => ({ countNormalize })

export const setTableMetric =
  (tableMetric: TableMetric) =>
  ({ defaultGraph, columnMetric }: GraphStore): Partial<GraphStore> => {
    const newHighlightMode = 'metrics'
    const highlights = highlightMetrics({ metric: tableMetric, graph: defaultGraph })
    const columnMetricMaxValue = highlightColumnMetrics({
      metric: columnMetric,
      graph: defaultGraph,
    })
    return {
      tableMetric,
      highlights,
      columnMetricMaxValue,
      highlightMode: newHighlightMode,
      graph: defaultGraph,
    }
  }

export const setColumnMetric =
  (columnMetric: ColumnMetric) =>
  ({ defaultGraph }: GraphStore) => {
    const columnMetricMaxValue = highlightColumnMetrics({
      metric: columnMetric,
      graph: defaultGraph,
    })

    return {
      columnMetric,
      columnMetricMaxValue,
    }
  }

export const setInitialStore = ({ graph, data, tables }: InitialArgs) => ({
  init: true,
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
  !['diffing', 'metrics'].includes(highlightMode) ? { highlights: defaultHighlights } : {}

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
    tableMetric,
    tables,
    selectedNodeId,
    highlights: curHighlights,
    highlightedColumns,
    columnMetric,
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

    if (highlightMode === 'metrics') {
      return {
        highlightMode,
        highlights: highlightMetrics({ metric: tableMetric, graph }),
        columnMetricMaxValue: highlightColumnMetrics({
          metric: columnMetric,
          graph: defaultGraph,
        }),
        selectedNodeId: undefined,
        highlightedColumns: defaultHighlightedColumns,
        graph: defaultGraph,
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
  tables: Table[]
}

const onHighlightModeChangeColumns = ({
  columnId,
  tableId,
  highlights,
  highlightMode,
  graph,
  tables,
}: OnChangeModeColumnsArgs) => {
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

  // TODO: Should we store indices ?
  const columnIndex: Traversable<{ tableId: string }> = tables.reduce((acc, t) => {
    const cols = t.columns.reduce(
      (accCols, col) => ({
        ...accCols,
        [col.id]: { ...col, tableId: t.id },
      }),
      {}
    )

    return { ...acc, ...cols }
  }, {})

  const depsIndex = Object.entries(columnIndex).reduce((acc: Traversable, [id, col]) => {
    if (!col.dependencies?.length) {
      return acc
    }

    col.dependencies.forEach((dep: string) => {
      if (!acc[dep]) {
        acc[dep] = { dependencies: [id] }
      }

      acc[dep].dependencies.push(id)
    })

    return acc
  }, {})

  let tableIds: string[] = []
  let columnDependcies: string[] = []
  let subgraphEdges: Edge[] = []
  if (highlightMode === 'parents') {
    columnDependcies = Object.keys(traverseGraph(depsIndex, columnId))
    tableIds = columnDependcies.map(col => columnIndex[col].tableId)
    subgraphEdges = graph.edges.filter(
      edge => tableIds.includes(edge.source) || !tableIds.includes(edge.target)
    )
  } else if (highlightMode === 'children') {
    columnDependcies = Object.keys(traverseGraph(columnIndex, columnId))
    tableIds = columnDependcies.map(col => columnIndex[col].tableId)
    subgraphEdges = graph.edges.filter(
      edge => !tableIds.includes(edge.source) || tableIds.includes(edge.target)
    )
  } else {
    columnDependcies = [
      ...(columnIndex[columnId]?.dependencies ?? []),
      ...(depsIndex[columnId]?.dependencies ?? []),
    ]
    tableIds = [...columnDependcies.map(col => columnIndex[col].tableId), tableId]
    subgraphEdges = graph.edges.filter(
      edge => tableIds.includes(edge.source) && tableIds.includes(edge.target)
    )
  }

  // Remove all unrelated to columns nodes and edges
  const subgraphNodes = graph.nodes.filter(node => tableIds.includes(node.id))
  const columnSubgraph = {
    nodes: subgraphNodes,
    edges: subgraphEdges,
    release: graph.release,
  }

  const newHighlights = highlightGraph(highlightMode, columnSubgraph, tableId)

  return {
    highlights: newHighlights,
    highlightedColumns: {
      selectedTableId: tableId,
      selectedColumnId: columnId,
      relatedColumnsIds: columnDependcies,
    },
  }
}
