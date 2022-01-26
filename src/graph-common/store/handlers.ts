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
  mapInitialNodes,
  mapInitialEdges,
} from '../ops'

import { traverseGraph, Traversable } from '../traversal'

import {
  Graph,
  ChromaticScale,
  Highlight,
  Highlights,
  TableMetric,
  ColumnMetric,
  DataGraph,
} from '../model'

import unionBy from 'lodash.unionby'

export const setCountNormalize = (countNormalize: boolean) => ({ countNormalize })
export const setTableMetric = (tableMetric: TableMetric) => ({ tableMetric })
export const setColumnMetric =
  (columnMetric: ColumnMetric) =>
  ({ selectedReleaseGraph }: GraphStore): Partial<GraphStore> => {
    const columnMetricMaxValue = highlightColumnMetrics({
      metric: columnMetric,
      graph: selectedReleaseGraph,
    })

    return {
      columnMetric,
      columnMetricMaxValue,
    }
  }

export const setInitialStore = ({ graph, data }: InitialArgs): Partial<GraphStore> => {
  const nodeIndex = graph.nodes.reduce(
    (acc, node) => ({
      ...acc,
      [node.data.label]: node,
    }),
    {}
  )

  const currentReleaseNodeNameIndex = {
    index: nodeIndex,
    release: graph.release,
  }

  return {
    init: true,
    graph,
    data,
    selectedReleaseGraph: graph,
    currentReleaseGraph: graph,
    currentReleaseNodeNameIndex,
  }
}

export const clearBaseRelease =
  () =>
  ({ currentReleaseGraph }: GraphStore): Partial<GraphStore> => ({
    baseRelease: '',
    selectedReleaseGraph: currentReleaseGraph,
    graph: currentReleaseGraph,

    // reset highlights
    highlights: defaultHighlights,
    highlightedColumns: defaultHighlightedColumns,
    selectedNodeId: undefined,
  })

export const setBaseRelease =
  (baseRelease: string) =>
  ({ data, highlightMode, currentReleaseGraph }: GraphStore): Partial<GraphStore> => {
    if (baseRelease) {
      const baseReleaseTables = rawGraphTables(data, baseRelease)
      const baseReleaseGraph = {
        nodes: mapInitialNodes(baseReleaseTables),
        edges: mapInitialEdges(baseReleaseTables),
        release: baseRelease,
      }

      if (highlightMode === 'diffing') {
        const currentReleaseTables = rawGraphTables(data, currentReleaseGraph.release)
        const baseGraph = getBaseGraph(baseRelease, data, currentReleaseTables)
        const { graph: mergedGraph, highlights } = baseGraph
          ? getMergedGraph(currentReleaseGraph, baseGraph)
          : getMergedGraph(currentReleaseGraph, currentReleaseGraph)

        return {
          baseRelease,
          selectedReleaseGraph: baseReleaseGraph,

          highlightMode,
          graph: mergedGraph,
          highlights,
          highlightedColumns: defaultHighlightedColumns,
        }
      }

      return {
        baseRelease,
        selectedReleaseGraph: baseReleaseGraph,
        graph: baseReleaseGraph,

        // reset highlights
        highlights: defaultHighlights,
        highlightedColumns: defaultHighlightedColumns,
        selectedNodeId: undefined,
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
    data,
    selectedReleaseGraph,
    highlightMode,
    highlightedColumns,
    highlights: curHighlights,
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
      data,
      graph: selectedReleaseGraph,
      highlights: curHighlights,
      highlightMode,
    })
  }

export const nodeClick =
  (id: string, chromaticScale: ChromaticScale) =>
  ({ highlightMode, selectedReleaseGraph }: GraphStore) => {
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

    const newHighlights = highlightGraph({
      highlightMode,
      graph: selectedReleaseGraph,
      nodeId: id,
      chromaticScale,
    })
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

// TODO: Highlights are better to reimplement with state machine pattern
export const setHighlightMode =
  (highlightMode: Highlight, chromaticScale: ChromaticScale) =>
  ({
    data,
    selectedReleaseGraph,
    currentReleaseGraph,
    baseRelease,
    tableMetric,
    selectedNodeId,
    highlights: curHighlights,
    highlightedColumns,
    columnMetric,
  }: GraphStore) => {
    if (highlightMode === 'diffing') {
      const currentReleaseTables = rawGraphTables(data, currentReleaseGraph.release)
      const baseGraph = getBaseGraph(baseRelease, data, currentReleaseTables)
      const { graph: mergedGraph, highlights } = baseGraph
        ? getMergedGraph(currentReleaseGraph, baseGraph)
        : getMergedGraph(currentReleaseGraph, currentReleaseGraph)

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
        highlights: highlightMetrics({ metric: tableMetric, graph: selectedReleaseGraph }),
        columnMetricMaxValue: highlightColumnMetrics({
          metric: columnMetric,
          graph: selectedReleaseGraph,
        }),
        selectedNodeId: undefined,
        highlightedColumns: defaultHighlightedColumns,
        graph: selectedReleaseGraph,
      }
    }

    const isInColumnContext = highlightedColumns.selectedColumnId !== ''
    if (isInColumnContext) {
      return {
        highlightMode,
        ...onHighlightModeChangeColumns({
          data,
          columnId: highlightedColumns.selectedColumnId,
          tableId: highlightedColumns.selectedTableId,
          graph: selectedReleaseGraph,
          highlights: curHighlights,
          highlightMode,
        }),
      }
    }

    if (highlightMode === 'none') {
      return {
        highlightMode,
        highlights: defaultHighlights,
        selectedNodeId: undefined,
        highlightedColumns: defaultHighlightedColumns,
        graph: selectedReleaseGraph,
      }
    }

    if (!selectedNodeId) {
      return {
        highlightMode,
        highlights: defaultHighlights,
        graph: selectedReleaseGraph,
        highlightedColumns: defaultHighlightedColumns,
      }
    }

    const newHighlights = highlightGraph({
      highlightMode,
      graph: selectedReleaseGraph,
      nodeId: selectedNodeId,
      chromaticScale,
    })

    return {
      highlightMode,
      highlights: newHighlights,
      graph: selectedReleaseGraph,
      highlightedColumns: defaultHighlightedColumns,
      selectedNodeId,
    }
  }

interface OnChangeModeColumnsArgs {
  columnId: string
  tableId: string
  highlights: Highlights
  highlightMode: Highlight
  data: DataGraph[]
  graph: Graph
}

const onHighlightModeChangeColumns = ({
  columnId,
  tableId,
  highlights,
  highlightMode,
  graph,
  data,
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

  const tables = rawGraphTables(data, graph.release)

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
  if (highlightMode === 'traversal') {
    const columnDependciesUpstream = Object.keys(traverseGraph(depsIndex, columnId))
    const tableIdsUpstream = columnDependciesUpstream.map(col => columnIndex[col].tableId)

    const columnDependciesDownstream = Object.keys(traverseGraph(columnIndex, columnId))
    const tableIdsDownstream = columnDependciesDownstream.map(col => columnIndex[col].tableId)

    columnDependcies = [...columnDependciesUpstream, ...columnDependciesDownstream]
    tableIds = unionBy(tableIdsUpstream, tableIdsDownstream)
  } else {
    columnDependcies = [
      ...(columnIndex[columnId]?.dependencies ?? []),
      ...(depsIndex[columnId]?.dependencies ?? []),
    ]
    tableIds = [...columnDependcies.map(col => columnIndex[col].tableId), tableId]
  }

  // Remove all unrelated to columns nodes and edges
  const subgraphNodes = graph.nodes.filter(node => tableIds.includes(node.id))
  const subgraphEdges = graph.edges.filter(
    edge => tableIds.includes(edge.source) && tableIds.includes(edge.target)
  )
  const columnSubgraph = {
    nodes: subgraphNodes,
    edges: subgraphEdges,
    release: graph.release,
  }

  const newHighlights = highlightGraph({
    highlightMode,
    graph,
    subgraph: columnSubgraph,
    nodeId: tableId,
  })

  return {
    highlights: newHighlights,
    highlightedColumns: {
      selectedTableId: tableId,
      selectedColumnId: columnId,
      relatedColumnsIds: columnDependcies,
    },
  }
}

const rawGraphTables = (rawGraphData: DataGraph[], release: string) =>
  rawGraphData.find(dataItem => dataItem.version === release)?.tables ?? []
