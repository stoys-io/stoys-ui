import React, { useCallback, useMemo, useState, useEffect } from 'react'
import GraphDrawer from './GraphDrawer'
import Sidebar from './Sidebar'
import { SearchArgs } from './SidebarSearch'
import { Container, DrawerContainer, GraphContainer } from './styles'

import HighlightedColumnsContext from './columnsHighlightContext'

import ReactFlow, { Background, isNode, Node as Node0, Edge as Edge0 } from 'react-flow-renderer'
import { Edge, Node, Graph, Highlight, Badge, Table, ChromaticScale, Orientation } from './model'
import { DagNode } from './DagNode'
import { getLayoutedElements } from './layout'
import {
  resetHighlight,
  findNeighborEdges,
  highlightNode,
  changeBadge,
  highlightGraph,
  findUpstreamEdges,
  findDownstreamEdges,
  collectParentColumnAndTableIds,
  collectChildColumnAndTableIds,
  notEmpty,
  highlightNodesBatch,
} from './graph-ops'

const GraphComponent = ({ data, config: cfg }: Props) => {
  const config: Required<Config> = { ...defaultConfig, ...cfg }
  const releases = Array.isArray(data) ? data.map(dataItem => dataItem.version) : [data.version]
  const currentRelease = config?.current || releases[0] // by default take first
  const baseReleases = releases.filter(release => release !== currentRelease).filter(notEmpty)
  const tables = Array.isArray(data)
    ? data?.find(dataItem => dataItem.version === currentRelease)?.tables
    : data?.tables

  const [drawerIsVisible, setDrawerVisibility] = useState<boolean>(false)
  const [drawerNodeId, setDrawerNodeId] = useState<string>('')
  const openDrawer = (id: string) => {
    setDrawerNodeId(id)
    setDrawerVisibility(true)
  }

  const drawerData = tables?.find(table => table.id === drawerNodeId)

  const [_highlightedColumns, _setHighlightedColumns] = useState<{
    selectedTableId: string
    selectedColumnId: string
    reletedColumnsIds: Array<string>
    reletedTablesIds: Array<string>
  }>({
    selectedTableId: '',
    selectedColumnId: '',
    reletedColumnsIds: [],
    reletedTablesIds: [],
  })

  const setHighlightedColumns = (columnId: string, tableId: string) => {
    if (columnId === _highlightedColumns.selectedColumnId) {
      return _setHighlightedColumns({
        selectedTableId: '',
        selectedColumnId: '',
        reletedColumnsIds: [],
        reletedTablesIds: [],
      })
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
    })
  }

  const [graph, setGraph] = useState<Graph>({
    nodes: mapInitialNodes(tables!, openDrawer),
    edges: mapInitialEdges(tables!),
  })

  const [highlight, setHighlight] = useState<Highlight>('nearest')
  const [badge, setBadge] = useState<Badge>('violations')
  const [baseRelease, setBaseRelease] = useState<string | number>('')

  const onBadgeChange = (value: Badge) => {
    setBadge(value)
    setGraph(changeBadge(value))
  }

  const onHighlightChange = (value: Highlight) => {
    setGraph(resetHighlight)
    setHighlight(value)
  }

  const onElementClick = (_: any, element: Node0 | Edge0) => {
    if (!isNode(element)) {
      return
    }

    setGraph(resetHighlight)

    const highlightEdges =
      highlight === 'parents'
        ? findUpstreamEdges(graph, element.id)
        : highlight === 'children'
        ? findDownstreamEdges(graph, element.id)
        : findNeighborEdges(graph, element.id)

    if (!highlightEdges.length) {
      setGraph(highlightNode(element.id))
    }

    setGraph(highlightGraph(highlightEdges))
  }

  const onPaneClick = () => {
    setGraph(resetHighlight)
    setDrawerVisibility(false)
    _setHighlightedColumns({
      selectedTableId: '',
      selectedColumnId: '',
      reletedColumnsIds: [],
      reletedTablesIds: [],
    })
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

  const onReleaseChange = useCallback(
    value => {
      setBaseRelease(value)

      const mergedGraph = getMergedGraph(value)

      if (mergedGraph) {
        setGraph(mergedGraph)
      }
    },
    [setBaseRelease, setGraph]
  )

  const baseDrawerData = useMemo(() => {
    if (!baseRelease || !Array.isArray(data)) {
      return undefined
    }

    return data
      ?.find(dataItem => dataItem.version === baseRelease)
      ?.tables?.find(table => table.name === drawerData?.name)
  }, [baseRelease, drawerData, data])

  const getMergedGraph = (_baseRelease: string): Graph | undefined => {
    if (!Array.isArray(data) || !_baseRelease) {
      return
    }

    const nameIds = tables?.reduce((acc: { [key: string]: string }, dataItem) => {
      acc[dataItem.name] = dataItem.id

      return acc
    }, {})
    const _baseTables = data?.find(dataItem => dataItem.version === _baseRelease)?.tables
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
      : null

    if (baseGraph) {
      const baseEdgeIds = baseGraph.edges.map(mapIds)
      const edgeIds = graph.edges.map(mapIds)
      const edges = graph.edges.map(edge => {
        if (baseEdgeIds.includes(edge.id)) {
          return edge
        }

        return {
          ...edge,
          style: { color: 'red' },
        }
      })
      const addedEdges = baseGraph.edges
        .filter(edge => !edgeIds.includes(edge.id))
        .map(edge => ({ ...edge, style: { color: 'green' } }))

      const mergedEdges = [...edges, ...addedEdges]

      const nodeIds = graph.nodes.map(mapIds)
      const baseNodeIds = graph.nodes.map(mapIds)
      const nodes = graph.nodes.map(node => {
        if (baseNodeIds.includes(node.id)) {
          return node
        }

        return {
          ...node,
          style: { color: 'red' },
        }
      })
      const addedNodes = baseGraph.nodes
        .filter(node => !nodeIds.includes(node.id))
        .map(node => ({ ...node, style: { color: 'green' } }))
      const mergedNodes = [...nodes, ...addedNodes]

      return {
        edges: mergedEdges,
        nodes: mergedNodes,
      }
    }
  }

  const elements = getLayoutedElements([...graph.nodes, ...graph.edges], config.orientation)
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
          onReleaseChange={onReleaseChange}
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
  data: DataGraph | Array<DataGraph>
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
      highlight: false,
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
      }))

      return [...acc, ...items]
    }, [])

function mapIds(element: { id: string }): string {
  return element.id
}
