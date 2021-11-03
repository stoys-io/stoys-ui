import React, { useMemo, useEffect, useRef } from 'react'
import ReactFlow, {
  ReactFlowProvider,
  Background,
  isNode,
  Node as Node0,
  Edge as Edge0,
} from 'react-flow-renderer'

import { Sidebar } from './components/Sidebar'
import { SearchArgs } from './components/SidebarSearch'
import { DagNode } from './components/DagNode'
import { DagEdge } from './components/DagEdge'

import { ConnectedDrawer } from './components/ConnectedDrawer'
import { DrawerTabs } from './components/DrawerTabs'

import { graphLayout } from './graph-layout'
import { useGraphStore } from './StoreProvider'
import { setInitialStore, resetHighlightedColumns, resetHighlights, nodeClick } from './graph-store'

import { Container, GraphContainer } from './styles'
import { Edge, Node, Graph, DataGraph, Table, ChromaticScale, Orientation } from './model'

import { notEmpty, highlightNodesBatch } from './graph-ops'
import { ADDED_NODE_HIGHLIGHT_COLOR, DELETED_NODE_HIGHLIHT_COLOR } from './constants'

const GraphComponent = ({ data, config: cfg }: Props) => {
  const config: Required<Config> = { ...defaultConfig, ...cfg }
  const containerRef = useRef<HTMLDivElement>(null)

  const releases = data.map(dataItem => dataItem.version)
  const currentRelease = config?.currentRelease || releases[0] // by default take first
  const baseReleases = releases
    .filter(release => release !== currentRelease)
    .filter(notEmpty)
    .map(release => ({ value: release, label: release }))

  const tables = useMemo(
    () => data?.find(dataItem => dataItem.version === currentRelease)?.tables,
    [data]
  )

  const currentGraph = {
    nodes: mapInitialNodes(tables!),
    edges: mapInitialEdges(tables!),
  }

  const dispatch = useGraphStore(state => state.dispatch)
  const setHighlights = useGraphStore(state => state.setHighlights)
  const searchNodeLabels = useGraphStore(state => state.searchNodeLabels)

  const onElementClick = (_: any, element: Node0 | Edge0) => {
    if (isNode(element)) {
      return dispatch(nodeClick(element.id, config.chromaticScale))
    }
  }

  const onPaneClick = () => {
    dispatch(resetHighlights)
    dispatch(resetHighlightedColumns)
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
    dispatch(
      setInitialStore({
        graph: currentGraph,
        data,
        tables,
      })
    )
    // TODO: Leave only currentGraph argument ?
  }, [])

  // TODO: Computing currentGraph layout is not fair in case of diffing
  const elements = graphLayout([...currentGraph.nodes, ...currentGraph.edges], config.orientation)
  return (
    <Container ref={containerRef}>
      <Sidebar
        onSearch={onSearchNode}
        releases={baseReleases}
        chromaticScale={config.chromaticScale}
      />
      <GraphContainer>
        <ReactFlowProvider>
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
        </ReactFlowProvider>
      </GraphContainer>
      <ConnectedDrawer containerRef={containerRef} isOpenDrawer={config.openDrawer}>
        <DrawerTabs />
      </ConnectedDrawer>
    </Container>
  )
}

export default GraphComponent

export interface Props {
  data: DataGraph[]
  config?: Config
}

interface Config {
  currentRelease?: string
  orientation?: Orientation
  openDrawer?: boolean

  // You can use any color scheme from https://github.com/d3/d3-scale-chromatic#sequential-single-hue
  // Pass the name of the scheme as chromaticScale prop (ex. 'interpolateBlues', 'interpolateGreens', etc.)
  chromaticScale?: ChromaticScale
}

const defaultConfig: Required<Config> = {
  orientation: 'horizontal',
  chromaticScale: 'interpolatePuOr',
  openDrawer: false,
  currentRelease: '',
}

const nodeTypes = {
  dagNode: DagNode,
}

const edgeTypes = {
  dagEdge: DagEdge,
}

const initialPosition = { x: 0, y: 0 }
const mapInitialNodes = (tables: Array<Table>): Node[] =>
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
