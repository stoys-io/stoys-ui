import React, { useCallback, useMemo, useState } from 'react'
import GraphDrawer from './GraphDrawer'
import Sidebar from './Sidebar'
import { Container, DrawerContainer, GraphContainer } from './styles'

import ReactFlow, { Background, isNode, Node as Node0, Edge as Edge0 } from 'react-flow-renderer'
import { Edge, Node, Graph, Highlight, Badge, Table, ChromaticScale } from './model'
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
} from './graph-ops'

const Graph2 = ({ data, config /* , chromaticScale */ }: Props) => {
  const releases = Array.isArray(data) ? data.map(dataItem => dataItem.version) : [data.version]
  const currentRelease = config?.current || releases[0] // by default take first
  const baseReleases = releases.filter(release => release !== currentRelease).filter(notEmpty)
  const tables = Array.isArray(data)
    ? data?.find(dataItem => dataItem.version === currentRelease)?.tables
    : data?.tables

  /* TODO: We might not need that many states for drawer */
  const [drawerIsVisible, setDrawerVisibility] = useState<boolean>(false)
  const [drawerHeight, setDrawerHeight] = useState(500) // TODO: Could possibly be moved into drawers local state?
  const [drawerNodeId, setDrawerNodeId] = useState<string>('')
  const [drawerTable, setDrawerTable] = useState<string>('')

  const openDrawer = (id: string) => {
    setDrawerNodeId(id)
    setDrawerVisibility(true)

    const table = tables?.find(table => table.id === id)
    table && setDrawerTable(table.name)
  }
  const drawerData = tables?.find(table => table.id === drawerNodeId)

  const setColumnHighlight = (columnId: string, tableId: string) => {
    const selectedTableSourceIds = graph.edges
      .filter(edge => edge.target === tableId)
      ?.map(edge => edge.source)
    const selectedTableTargetsIds = graph.edges
      .filter(edge => edge.source === tableId)
      ?.map(edge => edge.target)
    const sourceTableColumnIds = tables
      ?.filter(table => selectedTableSourceIds.includes(table.id))
      .map(table => table.columns.find(column => column.dependencies?.includes(columnId))?.id)
    const selectedColumnDependcies = tables
      ?.find(table => table.id === tableId)
      ?.columns.find(column => column.id === columnId)?.dependencies
    const columnDependcies = [
      ...(sourceTableColumnIds ? sourceTableColumnIds : []),
      ...(selectedColumnDependcies ? selectedColumnDependcies : []),
    ].filter(notEmpty)
    const tableIds = [...selectedTableSourceIds, ...selectedTableTargetsIds].filter(notEmpty)

    setGraph({
      ...graph,
      nodes: graph.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          highlightedColumns: {
            selectedTableId: tableId,
            selectedColumnId: columnId,
            reletedColumnsIds: columnDependcies,
            reletedTablesIds: tableIds,
          },
        },
      })),
    })
  }

  const [graph, setGraph] = useState<Graph>({
    nodes: mapInitialNodes(tables!, openDrawer, setColumnHighlight),
    edges: mapInitialEdges(tables!),
  })

  const [highlight, setHighlight] = useState<Highlight>('nearest')
  const [badge, setBadge] = useState<Badge>('violations')
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchError, setSearchError] = useState<boolean>(false)

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

  const onPaneClick = () => setGraph(resetHighlight)

  const onSearchNode = () => {
    if (!searchValue) {
      return
    }

    const node = graph.nodes.find((node: Node) => node.data?.label.indexOf(searchValue) !== -1)
    if (!node) {
      return setSearchError(true)
    }

    if (searchError) {
      return setSearchError(false)
    }

    setGraph(prevGraph => highlightNode(node.id)(resetHighlight(prevGraph)))
  }

  const onReleaseChange = useCallback(
    value => {
      setBaseRelease(value)
    },
    [setBaseRelease]
  )

  const baseDrawerData = useMemo(() => {
    if (!baseRelease || !Array.isArray(data)) {
      return undefined
    }

    return data
      ?.find(dataItem => dataItem.version === baseRelease)
      ?.tables?.find(table => table.name === drawerData?.name)
  }, [baseRelease, drawerData, data])

  const elements = getLayoutedElements([...graph.nodes, ...graph.edges])
  return (
    <Container>
      <Sidebar
        drawerHeight={drawerIsVisible ? drawerHeight : 0}
        badge={badge}
        onBadgeChange={onBadgeChange}
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        onSearch={onSearchNode}
        searchError={searchError}
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
        >
          <Background />
        </ReactFlow>
      </GraphContainer>
      {drawerData && (
        <DrawerContainer>
          <GraphDrawer
            data={drawerData}
            baseData={baseDrawerData}
            drawerHeight={drawerHeight}
            setDrawerHeight={setDrawerHeight}
            table={drawerTable}
            setDrawerTable={setDrawerTable}
            visible={drawerIsVisible}
            setDrawerVisibility={setDrawerVisibility}
          />
        </DrawerContainer>
      )}
    </Container>
  )
}

export default Graph2

// TODO: move to model.ts
interface DataGraph {
  id: string
  name: string
  version: string
  tables: Table[]
}

interface Props {
  data: DataGraph | Array<DataGraph>
  config?: {
    current?: string
  }

  // You can use any color scheme from https://github.com/d3/d3-scale-chromatic#sequential-single-hue
  // Pass the name of the scheme as chromaticScale prop (ex. 'interpolateBlues', 'interpolateGreens', etc.)
  chromaticScale?: ChromaticScale
}

const nodeTypes = {
  dagNode: DagNode,
}

const initialPosition = { x: 0, y: 0 }
const mapInitialNodes = (
  tables: Array<Table>,
  openDrawer: (_: string) => void,
  setColumnHighlight: (columnId: string, tableId: string) => void
): Node[] =>
  tables.map((table: Table) => ({
    id: table.id,
    data: {
      label: table.name,
      highlight: false,
      badge: 'violations',
      partitions: table.measures.rows,
      violations: table.measures.violations ?? 0,
      columns: table.columns,
      onTitleClick: openDrawer,
      onListItemClick: setColumnHighlight,
    },
    position: initialPosition,
    type: 'dagNode',
  }))

const mapInitialEdges = (tables: Array<Table>): Edge[] =>
  tables
    .filter((t: Table) => t.dependencies !== undefined)
    .reduce((acc: Edge[], table: Table) => {
      const items = table.dependencies!.map(dep => ({
        id: `el-${dep}`,
        source: table.id,
        target: dep,
        style: undefined, // Edge color will be set by style field
      }))

      return [...acc, ...items]
    }, [])

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}
