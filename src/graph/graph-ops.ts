import {
  ADDED_NODE_HIGHLIGHT_COLOR,
  DELETED_NODE_HIGHLIHT_COLOR,
  HIGHLIGHT_COLOR,
} from './constants'
import { Graph, Edge, Node, DataGraph, Table, ChromaticScale, Highlight } from './model'
import { colorScheme } from './graph-color-scheme'

export const highlightNode = (id: string) => (graph: Graph) => ({
  ...graph,
  nodes: graph.nodes.map((node: Node) => {
    if (node.id !== id) {
      return node
    }

    return {
      ...node,
      data: {
        ...node.data,
        style: node.style?.color ? undefined : { color: HIGHLIGHT_COLOR },
      },
    }
  }),
})

export const resetHighlight = (graph: Graph): Graph => ({
  edges: graph.edges.map((edge: Edge) => ({
    ...edge,
    style: undefined,
    data: { rank: 1 },
  })),
  nodes: graph.nodes.map((node: Node) => ({
    ...node,
    data: { ...node.data, style: undefined },
  })),
  release: graph.release,
})

export const highlightNodesBatch = (ids: string[]) => (graph: Graph) => ({
  ...graph,
  nodes: graph.nodes.map((node: Node) => {
    if (!ids.includes(node.id)) {
      return {
        ...node,
        data: { ...node.data, style: undefined },
      }
    }

    return {
      ...node,
      data: { ...node.data, style: node.style?.color ? undefined : { color: HIGHLIGHT_COLOR } },
    }
  }),
})

export const highlightGraph =
  (
    nodeId: string,
    edgesToHighlight: Edge[],
    highlight: Highlight,
    chromaticScale: ChromaticScale
  ) =>
  (graph: Graph) => {
    const getColor = colorScheme(highlight, chromaticScale)

    return {
      edges: graph.edges.map((edge: Edge) => {
        const highlightEdge = edgesToHighlight.find((hEdge: Edge) => hEdge.id === edge.id)
        if (!highlightEdge) {
          return {
            ...edge,
            style: { strokeWidth: 0 }, // Hide other edges
          }
        }

        return {
          ...highlightEdge,
          style: { stroke: getColor(highlightEdge.data.rank), strokeWidth: '2px' },
        }
      }),
      nodes: graph.nodes.map((node: Node) => {
        const relevantEdges = edgesToHighlight.filter(
          edge => edge.source === node.id || edge.target === node.id
        )

        const relevantEdge = relevantEdges.reduce(
          // Node will have the rank lowest of its edges
          (cur, next) => (cur.data.rank < next.data.rank ? cur : next),
          relevantEdges[0]
        )

        if (!relevantEdge) {
          return node
        }

        return {
          ...node,
          data: {
            ...node.data,
            style: node.style?.color
              ? undefined
              : { color: node.id === nodeId ? HIGHLIGHT_COLOR : getColor(relevantEdge.data.rank) },
          },
        }
      }),
      release: graph.release,
    }
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

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

export function collectChildColumnAndTableIds(
  tId: string,
  cId: string,
  edges: Array<Edge>,
  tables?: Array<Table>
): ColumnAndTableIds {
  let tableQueue = [tId]
  let columnsResult = [cId]
  let tableResult: Array<string | undefined> = []

  while (tableQueue.length) {
    const currentTableId = tableQueue.shift()

    tableResult.push(currentTableId)

    const currentTableColumnsDependencies = tables
      ?.find(table => table.id === currentTableId)
      ?.columns.filter(column => columnsResult.includes(column.id))
      .map(column => column.dependencies)
      .flat()
      .filter(notEmpty)
    columnsResult.push(...(currentTableColumnsDependencies ? currentTableColumnsDependencies : []))

    edges
      .filter(edge => edge.source === currentTableId)
      .forEach(edge => tableQueue.push(edge.target))
  }

  return {
    tableIds: tableResult.filter(id => id !== tId).filter(notEmpty),
    columnIds: columnsResult.filter(id => id !== cId),
  }
}

export function collectParentColumnAndTableIds(
  tId: string,
  cId: string,
  edges: Array<Edge>,
  tables?: Array<Table>
): ColumnAndTableIds {
  let tableQueue = [tId]
  let columnsResult = [cId]
  let tableResult: Array<string | undefined> = []

  while (tableQueue.length) {
    const currentTableId = tableQueue.shift()

    tableResult.push(currentTableId)

    const currentTableColumnsDependencies = tables
      ?.find(table => table.id === currentTableId)
      ?.columns.filter(column => columnsResult.some(cr => column.dependencies?.includes(cr)))
      .map(column => column.id)
      .filter(notEmpty)
    columnsResult.push(...(currentTableColumnsDependencies ? currentTableColumnsDependencies : []))

    edges
      .filter(edge => edge.target === currentTableId)
      .forEach(edge => tableQueue.push(edge.source))
  }

  return {
    tableIds: tableResult.filter(id => id !== tId).filter(notEmpty),
    columnIds: columnsResult.filter(id => id !== cId),
  }
}

export interface ColumnAndTableIds {
  tableIds: Array<string>
  columnIds: Array<string>
}

const highlightDispatch = (highlightMode: Highlight) =>
  highlightMode === 'parents'
    ? findUpstreamEdges
    : highlightMode === 'children'
    ? findDownstreamEdges
    : findNearestEdges

// TODO: To much highlight in the names
export const highlightHighlight = (highlightMode: Highlight) => {
  const whichHighlight = highlightDispatch(highlightMode)

  return (graph: Graph, id: string, chromaticScale: ChromaticScale = 'interpolatePuOr'): Graph => {
    const highlightEdges = whichHighlight(graph, id)

    if (!highlightEdges.length) {
      const tmpHighlightGraph = highlightNode(id)(graph) // TODO: Refactor
      return tmpHighlightGraph
    }

    const tmpHighlightGraph2 = highlightGraph(
      id,
      highlightEdges,
      highlightMode,
      chromaticScale
    )(graph) // TODO: Refactor

    return tmpHighlightGraph2
  }
}

export const getBaseGraph = (
  baseRelease: string,
  data?: DataGraph[],
  tables?: Table[]
): Graph | undefined => {
  if (!baseRelease) {
    return
  }

  const nameIds = tables?.reduce((acc: { [key: string]: string }, dataItem) => {
    acc[dataItem.name] = dataItem.id

    return acc
  }, {})
  const _baseTables = data?.find(dataItem => dataItem.version === baseRelease)?.tables
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

export const getMergedGraph = (currentGraph: Graph, baseGraph: Graph): Graph => {
  const baseEdgeIds = baseGraph.edges.map(mapIds)
  const edgeIds = currentGraph.edges.map(mapIds)
  const edges = currentGraph.edges.map(edge => {
    if (baseEdgeIds.includes(edge.id)) {
      return edge
    }

    return {
      ...edge,
      style: { stroke: DELETED_NODE_HIGHLIHT_COLOR },
    }
  })
  const addedEdges = baseGraph.edges
    .filter(edge => !edgeIds.includes(edge.id))
    .map(edge => ({ ...edge, style: { stroke: ADDED_NODE_HIGHLIGHT_COLOR } }))

  const mergedEdges = [...edges, ...addedEdges]

  const nodeIds = currentGraph.nodes.map(mapIds)
  const baseNodeIds = baseGraph.nodes.map(mapIds)
  const nodes = currentGraph.nodes.map(node => {
    if (baseNodeIds.includes(node.id)) {
      const currentColumnsNames = node.data.columns.map(column => column.name)
      const baseColumns = baseGraph.nodes.find(n => node.id === n.id)?.data.columns
      const baseColumnsNames = baseColumns?.map(column => column.name)
      const addedColumns = node.data.columns
        .filter(column => !baseColumnsNames?.includes(column.name))
        .map(column => ({ ...column, style: { color: ADDED_NODE_HIGHLIGHT_COLOR } }))
      const addedColumnsNames = addedColumns.map(column => column.name)
      const deletedColumns = baseColumns
        ?.filter(column => !currentColumnsNames.includes(column.name))
        .map(column => ({ ...column, style: { color: DELETED_NODE_HIGHLIHT_COLOR } }))
      const _columns = node.data.columns.filter(column => !addedColumnsNames?.includes(column.name))
      const columns = [...addedColumns, ...(deletedColumns ? deletedColumns : []), ..._columns]

      return { ...node, data: { ...node.data, columns } }
    }

    return {
      ...node,
      data: {
        ...node.data,
        style: { color: DELETED_NODE_HIGHLIHT_COLOR },
      },
    }
  })
  const addedNodes = baseGraph?.nodes
    .filter(node => !nodeIds.includes(node.id))
    .map(node => ({
      ...node,
      data: { ...node.data, style: { color: ADDED_NODE_HIGHLIGHT_COLOR } },
    }))
  const mergedNodes = [...nodes, ...(addedNodes ? addedNodes : [])]

  return {
    edges: mergedEdges,
    nodes: mergedNodes,
    release: `merged-${baseGraph?.release}`,
  }
}

function mapIds(element: { id: string }): string {
  return element.id
}

const initialPosition = { x: 0, y: 0 }
export const mapInitialNodes = (tables: Array<Table>): Node[] =>
  tables.map(
    (table: Table): Node => ({
      id: table.id,
      data: {
        label: table.name,
        partitions: table.measures?.rows ?? 0,
        violations: table.measures?.violations ?? 0,
        columns: table.columns,
      },
      position: initialPosition,
      type: 'dagNode',
    })
  )

export const mapInitialEdges = (tables: Array<Table>): Edge[] =>
  tables
    .filter((t: Table) => t.dependencies !== undefined)
    .reduce((acc: Edge[], table: Table) => {
      const items = table.dependencies!.map(
        (dep: string): Edge => ({
          id: `${table.id}-${dep}-${table.name}`,
          source: table.id,
          target: dep,
          style: undefined, // Edge color will be set by style field
          data: { rank: 1 },
          type: 'dagEdge',
        })
      )

      return [...acc, ...items]
    }, [])
