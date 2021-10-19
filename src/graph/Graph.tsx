import React, { useCallback, useMemo, useState, useEffect } from 'react'
import ReactFlow, { Background, isNode, Node as Node0, Edge as Edge0 } from 'react-flow-renderer'

import GraphDrawer from './components/GraphDrawer'
import Sidebar from './components/Sidebar'
import { SearchArgs } from './components/SidebarSearch'
import { DagNode } from './components/DagNode'
import { DagEdge } from './components/DagEdge'

import HighlightedColumnsContext from './columnsHighlightContext'
import { graphLayout } from './graph-layout'
import { useGraphStore } from './graph-store'

import { Container, DrawerContainer, GraphContainer } from './styles'
import { Edge, Node, Graph, Highlight, Table, ChromaticScale, Orientation } from './model'

import {
  collectParentColumnAndTableIds,
  collectChildColumnAndTableIds,
  notEmpty,
  highlightNodesBatch,
} from './graph-ops'
import { ADDED_NODE_HIGHLIGHT_COLOR, DELETED_NODE_HIGHLIHT_COLOR } from './constants'

const defaultHighlightedColumns = {
  selectedTableId: '',
  selectedColumnId: '',
  reletedColumnsIds: [],
  reletedTablesIds: [],
  highlightedType: 'nearest' as 'nearest',
}

const GraphComponent = ({ data, config: cfg }: Props) => {
  const config: Required<Config> = { ...defaultConfig, ...cfg }

  const releases = data.map(dataItem => dataItem.version)
  const currentRelease = config?.current || releases[0] // by default take first
  const baseReleases = releases
    .filter(release => release !== currentRelease)
    .filter(notEmpty)
    .map(release => ({ value: release, label: release }))

  const tables = useMemo(
    () => data?.find(dataItem => dataItem.version === currentRelease)?.tables,
    [data]
  )

  const setInitialStore = useGraphStore(state => state.setInitialStore)
  const setHighlights = useGraphStore(state => state.setHighlights)
  const resetHighlights = useGraphStore(state => state.resetHighlights)
  const nodeClick = useGraphStore(state => state.nodeClick)
  const searchNodeLabels = useGraphStore(state => state.searchNodeLabels)

  const getHighlightMode = useGraphStore(state => state.getHighlightMode) // TODO: Remove
  const getCurrentGraph = useGraphStore(state => state.getCurrentGraph) // TODO: Remove

  const [drawerIsVisible, setDrawerVisibility] = useState<boolean>(false)
  const [drawerNodeId, setDrawerNodeId] = useState<string>('')
  const openDrawer = useCallback(
    (id: string) => {
      setDrawerNodeId(id)
      setDrawerVisibility(true)
    },
    [setDrawerNodeId, setDrawerVisibility]
  )

  const drawerData = tables?.find(table => table.id === drawerNodeId)

  const [_highlightedColumns, _setHighlightedColumns] = useState<{
    highlightedType: Highlight
    selectedTableId: string
    selectedColumnId: string
    reletedColumnsIds: Array<string>
    reletedTablesIds: Array<string>
  }>(defaultHighlightedColumns)

  const setHighlightedColumns = (columnId: string, tableId: string) => {
    if (columnId === _highlightedColumns.selectedColumnId) {
      return _setHighlightedColumns(defaultHighlightedColumns)
    }

    const graph = getCurrentGraph()
    const highlightMode = getHighlightMode()

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

    return _setHighlightedColumns({
      selectedTableId: tableId,
      selectedColumnId: columnId,
      reletedColumnsIds: columnDependcies,
      reletedTablesIds: tableIds,
      highlightedType: highlightMode,
    })
  }

  const currentGraph = useMemo(
    () => ({
      nodes: mapInitialNodes(tables!, openDrawer),
      edges: mapInitialEdges(tables!),
    }),
    [tables, openDrawer]
  )

  const onElementClick = (_: any, element: Node0 | Edge0) => {
    if (isNode(element)) {
      return nodeClick(element.id)
    }
  }

  const onPaneClick = () => {
    resetHighlights()
    setDrawerVisibility(false)
    _setHighlightedColumns(defaultHighlightedColumns)
  }

  const onSearchNode = ({ val, err, onError }: SearchArgs) => {
    if (!val) {
      return
    }
    const nodeIds = searchNodeLabels(val)

    if (!nodeIds?.length) {
      return onError(true)
    }

    if (err) {
      return onError(false)
    }

    setHighlights(highlightNodesBatch(nodeIds))
  }

  useEffect(() => {
    setInitialStore({
      graph: currentGraph,
      data,
      tables,
      openDrawer,
      chromaticScale: config.chromaticScale,
    }) // TODO: Leave only currentGraph argument
  }, [])

  // TODO: Computing currentGraph layout is not fair in case of diffing
  const elements = graphLayout([...currentGraph.nodes, ...currentGraph.edges], config.orientation)
  return (
    <HighlightedColumnsContext.Provider value={{ ..._highlightedColumns, setHighlightedColumns }}>
      <Container>
        <Sidebar onSearch={onSearchNode} releases={baseReleases} />
        <GraphContainer>
          <ReactFlow
            nodesDraggable={false}
            onElementClick={onElementClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            elements={elements}
            onlyRenderVisibleElements={true}
            nodesConnectable={false}
            minZoom={0.2}
          >
            <Background />
          </ReactFlow>
        </GraphContainer>
        {drawerData && (
          <DrawerContainer>
            {/* TODO: Change GraphDrawer interface to more sane */}
            <GraphDrawer
              data={drawerData}
              dataData={data}
              drawerMaxHeight={500}
              visible={drawerIsVisible}
              setDrawerVisibility={setDrawerVisibility}
            />
          </DrawerContainer>
        )}
      </Container>
    </HighlightedColumnsContext.Provider>
  )
}

export default GraphComponent

// TODO: move to model.ts
export interface DataGraph {
  id: string
  name: string
  version: string
  tables: Table[]
}

interface Props {
  data: Array<DataGraph>
  config?: Config
}

interface Config {
  current?: string
  orientation?: Orientation

  // You can use any color scheme from https://github.com/d3/d3-scale-chromatic#sequential-single-hue
  // Pass the name of the scheme as chromaticScale prop (ex. 'interpolateBlues', 'interpolateGreens', etc.)
  chromaticScale?: ChromaticScale
}

const defaultConfig: Required<Config> = {
  orientation: 'horizontal',
  chromaticScale: 'interpolatePuOr',
  current: '',
}

const nodeTypes = {
  dagNode: DagNode,
}

const edgeTypes = {
  dagEdge: DagEdge,
}

const initialPosition = { x: 0, y: 0 }
const mapInitialNodes = (tables: Array<Table>, openDrawer: (_: string) => void): Node[] =>
  tables.map(
    (table: Table): Node => ({
      id: table.id,
      data: {
        label: table.name,
        partitions: table.measures?.rows ?? 0,
        violations: table.measures?.violations ?? 0,
        columns: table.columns,
        onTitleClick: openDrawer,
      },
      position: initialPosition,
      type: 'dagNode',
    })
  )

const mapInitialEdges = (tables: Array<Table>): Edge[] =>
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

function mapIds(element: { id: string }): string {
  return element.id
}

// TODO: refactor and move these blobs to graph-ops
export const getBaseGraph = (
  baseRelease: string,
  openDrawer: (_: string) => void,
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
        nodes: mapInitialNodes(baseTables, openDrawer),
        edges: mapInitialEdges(baseTables),
      }
    : undefined

  return baseGraph
}

export const getMergedGraph = (currentGraph: Graph, baseGraph?: Graph): Graph => {
  const baseEdgeIds = baseGraph?.edges.map(mapIds)
  const edgeIds = currentGraph.edges.map(mapIds)
  const edges = currentGraph.edges.map(edge => {
    if (baseEdgeIds?.includes(edge.id)) {
      return edge
    }

    return {
      ...edge,
      style: { stroke: DELETED_NODE_HIGHLIHT_COLOR },
    }
  })
  const addedEdges = baseGraph?.edges
    .filter(edge => !edgeIds.includes(edge.id))
    .map(edge => ({ ...edge, style: { stroke: ADDED_NODE_HIGHLIGHT_COLOR } }))

  const mergedEdges = [...edges, ...(addedEdges ? addedEdges : [])]

  const nodeIds = currentGraph.nodes.map(mapIds)
  const baseNodeIds = baseGraph?.nodes.map(mapIds)
  const nodes = currentGraph.nodes.map(node => {
    if (baseNodeIds?.includes(node.id)) {
      const currentColumnsNames = node.data.columns.map(column => column.name)
      const baseColumns = baseGraph?.nodes.find(n => node.id === n.id)?.data.columns
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
  }
}
