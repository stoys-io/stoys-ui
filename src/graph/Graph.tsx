import React, { useCallback, useMemo, useState, useEffect } from 'react'
import ReactFlow, { Background, isNode, Node as Node0, Edge as Edge0 } from 'react-flow-renderer'
import { SelectValue } from 'antd/lib/select'

import GraphDrawer from './components/GraphDrawer'
import Sidebar from './components/Sidebar'
import { SearchArgs } from './components/SidebarSearch'
import { DagNode } from './components/DagNode'

import HighlightedColumnsContext from './columnsHighlightContext'
import { graphLayout } from './graph-layout'

import { Container, DrawerContainer, GraphContainer } from './styles'
import { Edge, Node, Graph, Highlight, Badge, Table, ChromaticScale, Orientation } from './model'

import {
  highlightNode,
  changeBadge,
  highlightGraph,
  findNearestEdges,
  findUpstreamEdges,
  findDownstreamEdges,
  collectParentColumnAndTableIds,
  collectChildColumnAndTableIds,
  notEmpty,
  highlightNodesBatch,
} from './graph-ops'
import {
  ADDED_NODE_HIGHLIGHT_COLOR,
  DELETED_NODE_HIGHLIHT_COLOR,
  HIGHLIGHT_COLOR,
} from './constants'

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

    let tableIds: Array<string> = []
    let columnDependcies: Array<string> = []

    if (highlight === 'parents') {
      const tableAndColumnsIds = collectParentColumnAndTableIds(
        tableId,
        columnId,
        graph.edges,
        tables
      )

      tableIds = tableAndColumnsIds.tableIds
      columnDependcies = tableAndColumnsIds.columnIds
    } else if (highlight === 'children') {
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
      highlightedType: highlight,
    })
  }

  const currentGraph = useMemo(
    () => ({
      nodes: mapInitialNodes(tables!, openDrawer),
      edges: mapInitialEdges(tables!),
    }),
    [tables, openDrawer]
  )

  const [graph, setGraph] = useState<Graph>(currentGraph)

  const [highlight, setHighlight] = useState<Highlight>('nearest')
  const [badge, setBadge] = useState<Badge>('violations')
  const [baseRelease, setBaseRelease] = useState<SelectValue>('')

  const onBadgeChange = (value: Badge) => {
    setBadge(value)
    setGraph(changeBadge(value))
  }

  const onHighlightChange = (value: Highlight) => {
    if (value === 'diffing' && baseGraph) {
      setGraph(mergedGraph)
    } else {
      setGraph(currentGraph)
    }
    setHighlight(value)
  }

  const onElementClick = (_: any, element: Node0 | Edge0) => {
    if (!isNode(element)) {
      return
    }

    if (highlight === 'diffing' && baseGraph) {
      setGraph(mergedGraph)
    } else {
      setGraph(currentGraph)
    }

    const highlightEdges = getHighlightEdges(element.id, highlight, graph)

    if (!highlightEdges.length) {
      return setGraph(highlightNode(element.id))
    }

    setGraph(highlightGraph(element.id, highlightEdges, highlight, config.chromaticScale))
  }

  const onPaneClick = () => {
    if (highlight === 'diffing' && baseGraph) {
      setGraph(mergedGraph)
    } else {
      setGraph(currentGraph)
    }
    setDrawerVisibility(false)
    _setHighlightedColumns(defaultHighlightedColumns)
  }

  const onSearchNode = ({ val, err, onError }: SearchArgs) => {
    if (!val) {
      return
    }

    const nodeIds = graph.nodes
      .filter((node: Node) => node.data?.label.indexOf(val.toLowerCase()) !== -1)
      .map(node => node.id)

    if (!nodeIds?.length) {
      return onError(true)
    }

    if (err) {
      return onError(false)
    }

    setGraph(highlightNodesBatch(nodeIds))
  }

  const baseDrawerData = useMemo(() => {
    if (!baseRelease) {
      return undefined
    }

    return data
      ?.find(dataItem => dataItem.version === baseRelease)
      ?.tables?.find(table => table.name === drawerData?.name)
  }, [baseRelease, drawerData, data])

  const baseGraph = useMemo(() => {
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
    const baseTables = _baseTables?.map(table => ({
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
  }, [baseRelease, data])

  const mergedGraph = useMemo(() => {
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
        const _columns = node.data.columns.filter(
          column => !addedColumnsNames?.includes(column.name)
        )
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
  }, [baseGraph, currentGraph])

  useEffect(() => {
    if (highlight === 'diffing' && baseGraph) {
      setGraph(mergedGraph)
    }
  }, [mergedGraph, setGraph, highlight, baseGraph])

  const elements = graphLayout([...graph.nodes, ...graph.edges], config.orientation)
  return (
    <HighlightedColumnsContext.Provider value={{ ..._highlightedColumns, setHighlightedColumns }}>
      <Container>
        <Sidebar
          badge={badge}
          onBadgeChange={onBadgeChange}
          onSearch={onSearchNode}
          highlight={highlight}
          onHighlightChange={onHighlightChange}
          releases={baseReleases}
          onReleaseChange={setBaseRelease}
        />
        <GraphContainer>
          <ReactFlow
            nodesDraggable={false}
            onElementClick={onElementClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
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
            <GraphDrawer
              data={drawerData}
              baseData={baseDrawerData}
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
interface DataGraph {
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

const initialPosition = { x: 0, y: 0 }
const mapInitialNodes = (tables: Array<Table>, openDrawer: (_: string) => void): Node[] =>
  tables.map((table: Table) => ({
    id: table.id,
    data: {
      label: table.name,
      highlightColor: HIGHLIGHT_COLOR,
      badge: 'violations',
      partitions: table.measures?.rows ?? 0,
      violations: table.measures?.violations ?? 0,
      columns: table.columns,
      onTitleClick: openDrawer,
    },
    position: initialPosition,
    type: 'dagNode',
  }))

const mapInitialEdges = (tables: Array<Table>): Edge[] =>
  tables
    .filter((t: Table) => t.dependencies !== undefined)
    .reduce((acc: Edge[], table: Table) => {
      const items = table.dependencies!.map(dep => ({
        id: `${table.id}-${dep}-${table.name}`,
        source: table.id,
        target: dep,
        style: undefined, // Edge color will be set by style field
        data: { rank: 1 },
      }))

      return [...acc, ...items]
    }, [])

function mapIds(element: { id: string }): string {
  return element.id
}

function getHighlightEdges(id: string, highlight: Highlight, graph: Graph) {
  if (highlight === 'parents') {
    return findUpstreamEdges(graph, id)
  }

  if (highlight === 'children') {
    return findDownstreamEdges(graph, id)
  }

  if (highlight === 'nearest') {
    return findNearestEdges(graph, id)
  }

  return []
}
