import React, { useCallback, useMemo, useState } from 'react'
import GraphDrawer from './GraphDrawer'
import Sidebar from './Sidebar'
import { SearchArgs } from './SidebarSearch'
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

const GraphComponent = ({ data, config, layoutDirection = 'LR' /* , chromaticScale */ }: Props) => {
  const releases = Array.isArray(data) ? data.map(dataItem => dataItem.version) : [data.version]
  const currentRelease = config?.current || releases[0] // by default take first
  const baseReleases = releases.filter(release => release !== currentRelease).filter(notEmpty)
  const tables = Array.isArray(data)
    ? data?.find(dataItem => dataItem.version === currentRelease)?.tables
    : data?.tables

  /* TODO: We might not need that many states for drawer */
  const [drawerIsVisible, setDrawerVisibility] = useState<boolean>(false)
  const [drawerNodeId, setDrawerNodeId] = useState<string>('')

  const openDrawer = useCallback(
    (id: string) => {
      setDrawerNodeId(id)
      setDrawerVisibility(true)
    },
    [drawerNodeId]
  )

  const drawerData = tables?.find(table => table.id === drawerNodeId)

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

  const onPaneClick = () => setGraph(resetHighlight)

  const onSearchNode = ({ val, err, onError }: SearchArgs) => {
    if (!val) {
      return
    }

    const node = graph.nodes.find((node: Node) => node.data?.label.indexOf(val) !== -1)
    if (!node) {
      return onError(true)
    }

    if (err) {
      return onError(false)
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

  const elements = getLayoutedElements([...graph.nodes, ...graph.edges], layoutDirection)
  return (
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
  config?: {
    current?: string
  }

  layoutDirection?: 'TB' | 'LR'
  // You can use any color scheme from https://github.com/d3/d3-scale-chromatic#sequential-single-hue
  // Pass the name of the scheme as chromaticScale prop (ex. 'interpolateBlues', 'interpolateGreens', etc.)
  chromaticScale?: ChromaticScale
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
      columns: table.columns.map(col => col.name),
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
        id: `el-${dep}-${table.name}`,
        source: table.id,
        target: dep,
        style: undefined, // Edge color will be set by style field
      }))

      return [...acc, ...items]
    }, [])

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}
