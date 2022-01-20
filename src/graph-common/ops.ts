import {
  ADDED_NODE_HIGHLIGHT_COLOR,
  DELETED_NODE_HIGHLIHT_COLOR,
  HIGHLIGHT_COLOR,
} from './constants'

import {
  Graph,
  Edge,
  Node,
  TableMetric,
  DataGraph,
  Table,
  ChromaticScale,
  Highlight,
  Highlights,
  GraphExtended,
  Column,
  ColumnMetric,
} from './model'

import { colorScheme, getChromaticColor, hyperbolicGradientRight } from './color-scheme'
import { defaultHighlights } from './store'

export const highlightSingleNode = (id: string): Highlights => ({
  edges: {},
  nodes: { [id]: { color: HIGHLIGHT_COLOR } },
})

export const highlightNodesBatch = (ids: string[]): Highlights => ({
  edges: {},
  nodes: ids.reduce(
    (acc, id: string) => ({
      ...acc,
      [id]: { color: HIGHLIGHT_COLOR },
    }),
    {}
  ),
})

interface HighlightHelperArgs {
  graph: Graph
  selectedNodeId: string
  edgesToHighlight: Edge[]
  highlightMode: Highlight
  chromaticScale: ChromaticScale
}

const highlightHelper = ({
  graph,
  selectedNodeId,
  edgesToHighlight,
  highlightMode,
  chromaticScale,
}: HighlightHelperArgs): Highlights => {
  const getColor = colorScheme(highlightMode, chromaticScale)
  const edges = graph.edges.reduce((acc, edge: Edge) => {
    const highlightEdge = edgesToHighlight.find((hEdge: Edge) => hEdge.id === edge.id)
    if (!highlightEdge) {
      return {
        ...acc,
        [edge.id]: { strokeWidth: '0' }, // Hide irrelevant edges
      }
    }

    const edgeStyleObject = {
      stroke: getColor(highlightEdge.data.rank),
      strokeWidth: '2px',
    }

    return {
      ...acc,
      [edge.id]: edgeStyleObject,
    }
  }, {})

  const nodes = graph.nodes.reduce((acc, node: Node) => {
    const relevantEdges = edgesToHighlight.filter(
      edge => edge.source === node.id || edge.target === node.id
    )

    const relevantEdge = relevantEdges.reduce(
      // Node will have the rank lowest of its edges
      (cur, next) => (cur.data.rank < next.data.rank ? cur : next),
      relevantEdges[0]
    )

    if (!relevantEdge) {
      return acc
    }

    const nodeStyleObject = {
      color: node.id === selectedNodeId ? HIGHLIGHT_COLOR : getColor(relevantEdge.data.rank),
    }

    return {
      ...acc,
      [node.id]: nodeStyleObject,
    }
  }, {})

  return { edges, nodes }
}

export const findNearestEdges = (graph: Graph, id: string): Edge[] => [
  ...graph.edges.filter(edge => edge.source === id).map(edge => ({ ...edge, data: { rank: 1 } })), // parents
  ...graph.edges.filter(edge => edge.target === id).map(edge => ({ ...edge, data: { rank: -1 } })), // children
]

const findEdgeHelper = (
  edges: Edge[],
  head: Edge,
  queue: Edge[],
  visited: Edge[],
  isUpstream: boolean = false,
  rank: number = 1
): Edge[] => {
  if (!queue.length) {
    return visited
  }

  const matchEdges = (edge: Edge, head: Edge) =>
    isUpstream ? edge.target === head.source : edge.source === head.target

  const neighbors = edges.filter(
    edge => matchEdges(edge, head) && !visited.find(v => v.id === edge.id)
  )

  const newRank = !neighbors.length ? rank : rank + 1
  const rankedNeighbors = !neighbors.length
    ? neighbors
    : neighbors.map(edge => ({ ...edge, data: { rank: newRank } }))

  const newQueue = [...queue].slice(1).concat(rankedNeighbors)
  const newHead = newQueue[0]
  const newVisited =
    newHead && !visited.find(v => v.id === newHead.id) ? [...visited, newHead] : visited

  return findEdgeHelper(edges, newHead, newQueue, newVisited, isUpstream, newRank)
}

export const findUpstreamEdges = (graph: Graph, id: string): Edge[] => {
  const startEdges = graph.edges.filter(edge => edge.target === id)
  if (!startEdges.length) {
    return []
  }

  const isUpstream = true
  const visitedEdges = findEdgeHelper(
    graph.edges,
    startEdges[0],
    startEdges,
    [startEdges[0]],
    isUpstream
  )
  return visitedEdges
}

export const findDownstreamEdges = (graph: Graph, id: string): Edge[] => {
  const startEdges = graph.edges.filter(edge => edge.source === id)
  if (!startEdges.length) {
    return []
  }

  const visitedEdges = findEdgeHelper(graph.edges, startEdges[0], startEdges, [startEdges[0]])
  return visitedEdges
}

interface HColumnMetricsArgs {
  metric: ColumnMetric
  graph: Graph
}

export const getMetricsColumnColor = (t: number) =>
  getChromaticColor(hyperbolicGradientRight(t, 0.2, 1), 'interpolateReds')

export const highlightColumnMetrics = ({ metric, graph }: HColumnMetricsArgs): number => {
  if (metric === 'none' || metric === 'data_type' || metric === 'pmf') {
    return 0
  }

  const allMetricValues = graph.nodes.reduce((acc: number[], node): number[] => {
    return [
      ...acc,
      ...node.data.columns.map(col => {
        const val = col.metrics?.[metric] ?? 0
        return typeof val !== 'string' ? val : !isNaN(+val) ? +val : 0
        // TODO: Metric types should be well defined
      }),
    ]
  }, [])

  const maxMetricValue = Math.max(...allMetricValues, 0)

  return maxMetricValue
}

interface HMetricsArgs {
  metric: TableMetric
  graph: Graph
}
export const highlightMetrics = ({ metric, graph }: HMetricsArgs): Highlights => {
  if (metric === 'none') {
    return defaultHighlights
  }

  const getColor = (rank: number) =>
    getChromaticColor(hyperbolicGradientRight(rank), 'interpolatePuOr')

  const maxMetricValue = Math.max(...graph.nodes.map(node => node.data[metric]), 0)
  const nodeHighlights = graph.nodes.reduce((acc, node) => {
    const normalizedMetricsVal = node.data[metric] / maxMetricValue
    const nodeColor = { color: getColor(normalizedMetricsVal) }

    return {
      ...acc,
      [node.id]: nodeColor,
    }
  }, {})

  return { nodes: nodeHighlights, edges: {} }
}

const searchFnDispatch = (highlightMode: Highlight) =>
  highlightMode === 'parents'
    ? findUpstreamEdges
    : highlightMode === 'children'
    ? findDownstreamEdges
    : findNearestEdges

export const highlightGraph = (
  highlightMode: Highlight,
  graph: Graph,
  id: string,
  chromaticScale: ChromaticScale = 'interpolatePuOr'
): Highlights => {
  const graphSearchFn = searchFnDispatch(highlightMode)
  const edgesToHighlight = graphSearchFn(graph, id)

  if (!edgesToHighlight.length) {
    return highlightSingleNode(id)
  }

  return highlightHelper({
    graph,
    selectedNodeId: id,
    edgesToHighlight,
    highlightMode,
    chromaticScale,
  })
}

export const getBaseGraph = (
  baseRelease: string,
  data: DataGraph[],
  tables?: Table[]
): Graph | undefined => {
  if (!baseRelease) {
    return
  }

  const nameIds = tables?.reduce((acc: { [key: string]: string }, dataItem) => {
    acc[dataItem.name] = dataItem.id

    return acc
  }, {})
  const _baseTables = data.find(dataItem => dataItem.version === baseRelease)?.tables
  const baseNameIds = _baseTables?.reduce((acc: { [key: string]: string }, dataItem) => {
    acc[dataItem.id] = dataItem.name

    return acc
  }, {})
  const baseTables = _baseTables?.map((table: Table) => ({
    ...table,
    id: nameIds && nameIds[table.name] ? nameIds[table.name] : table.id,
    dependencies: table.dependencies?.map(dep =>
      baseNameIds && nameIds && baseNameIds[dep] && nameIds[baseNameIds[dep]]
        ? nameIds[baseNameIds[dep]]
        : dep
    ),
  }))
  const baseGraph = baseTables
    ? {
        nodes: mapInitialNodes(baseTables),
        edges: mapInitialEdges(baseTables),
        release: baseRelease,
      }
    : undefined

  return baseGraph
}

export const getMergedGraph = (currentGraph: Graph, baseGraph: Graph): GraphExtended => {
  const baseEdgeIds = baseGraph.edges.map(mapIds)
  const edgeIds = currentGraph.edges.map(mapIds)
  const edges = currentGraph.edges
  const edgeHighlightsDeleted = edges.reduce(
    (acc, edge) =>
      !baseEdgeIds.includes(edge.id)
        ? { ...acc, [edge.id]: { stroke: DELETED_NODE_HIGHLIHT_COLOR } }
        : acc,
    {}
  )

  const addedEdges = baseGraph.edges.filter(edge => !edgeIds.includes(edge.id))
  const edgeHighlightsAdded = addedEdges.reduce(
    (acc, edge) => ({ ...acc, [edge.id]: { stroke: ADDED_NODE_HIGHLIGHT_COLOR } }),
    {}
  )

  const mergedEdges = [...edges, ...addedEdges]

  const nodeIds = currentGraph.nodes.map(mapIds)
  const baseNodeIds = baseGraph.nodes.map(mapIds)
  const nodes = currentGraph.nodes.map(node => {
    if (baseNodeIds.includes(node.id)) {
      const currentColumnsNames = node.data.columns.map(column => column.name)
      const baseColumns = baseGraph.nodes.find(n => node.id === n.id)?.data.columns
      const baseColumnsNames = baseColumns?.map(column => column.name)

      // TODO: Move to columnHighlights
      const addedColumns = node.data.columns
        .filter(column => !baseColumnsNames?.includes(column.name))
        .map(column => ({ ...column, style: { color: ADDED_NODE_HIGHLIGHT_COLOR } }))
      const addedColumnsNames = addedColumns.map(column => column.name)

      // TODO: Move to columnHighlights
      const deletedColumns = baseColumns
        ?.filter(column => !currentColumnsNames.includes(column.name))
        .map(column => ({ ...column, style: { color: DELETED_NODE_HIGHLIHT_COLOR } }))

      const _columns = node.data.columns.filter(column => !addedColumnsNames?.includes(column.name))
      const columns = [...addedColumns, ...(deletedColumns ? deletedColumns : []), ..._columns]

      return { ...node, data: { ...node.data, columns } }
    }

    return node
  })

  const nodeHighlightsDeleted = nodes.reduce(
    (acc, node) =>
      !baseNodeIds.includes(node.id)
        ? { ...acc, [node.id]: { color: DELETED_NODE_HIGHLIHT_COLOR } }
        : acc,
    {}
  )

  const addedNodes = baseGraph?.nodes.filter(node => !nodeIds.includes(node.id))
  const nodeHighlightsAdded = addedNodes.reduce(
    (acc, node) => ({ ...acc, [node.id]: { color: ADDED_NODE_HIGHLIGHT_COLOR } }),
    {}
  )

  const mergedNodes = [...nodes, ...(addedNodes ? addedNodes : [])]
  const graph = {
    edges: mergedEdges,
    nodes: mergedNodes,
    release: `merged-${baseGraph?.release}`,
  }

  const highlights = {
    edges: { ...edgeHighlightsDeleted, ...edgeHighlightsAdded },
    nodes: { ...nodeHighlightsDeleted, ...nodeHighlightsAdded },
  }

  return { graph, highlights }
}

function mapIds(element: { id: string }): string {
  return element.id
}

const initialPosition = { x: 0, y: 0 }
export const mapInitialNodes = (tables: Table[]): Node[] =>
  tables.map(
    (table: Table): Node => ({
      id: table.id,
      data: {
        label: table.name,
        partitions: table.measures?.rows ?? 0,
        violations: table.measures?.violations ?? 0,
        columns: columnsWithExtraData(table),
      },
      ...(table.groupId ? { groupId: table.groupId } : {}),
      ...(table.rootId ? { rootId: table.rootId } : {}),
      position: initialPosition,
      type: 'dagNode',
    })
  )

export const mapInitialEdges = (tables: Table[]): Edge[] =>
  tables
    .filter((t: Table) => t.dependencies !== undefined)
    .reduce((acc: Edge[], table: Table) => {
      const items = table.dependencies!.map(
        (dep: string): Edge => ({
          id: `${table.id}-${dep}-${table.name}`,
          source: table.id,
          target: dep,
          data: { rank: 1 },
          type: 'dagEdge',
        })
      )

      return [...acc, ...items]
    }, [])

const columnsWithExtraData = (table: Table): Column[] => {
  if (table.dp_result === undefined) {
    return table.columns
  }

  const dpColumns = table.dp_result.columns
  const columns = table.columns.map(column => {
    const dpColumn = dpColumns.find(dpCol => dpCol.name === column.name)
    if (!dpColumn) {
      return column
    }

    const {
      data_type: dt,
      nullable,
      count,
      count_empty,
      count_nulls,
      count_unique,
      count_zeros,
      max_length,
      min,
      max,
      mean,
      pmf,
    } = dpColumn

    const data_type = {
      type: dt,
      nullable: nullable || false,
    }

    const metrics = {
      data_type,
      count,
      // Only non-`null` metrics
      ...(count_empty ? { count_empty } : {}),
      ...(count_nulls ? { count_nulls } : {}),
      ...(count_unique ? { count_unique } : {}),
      ...(count_zeros ? { count_zeros } : {}),
      ...(max_length ? { max_length } : {}),
      ...(min ? { min } : {}),
      ...(max ? { max } : {}),
      ...(mean ? { mean } : {}),
      ...(pmf ? { pmf } : {}),
    }

    return { ...column, metrics }
  })

  return columns
}
