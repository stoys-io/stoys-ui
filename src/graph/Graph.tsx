import React, { useState } from 'react'
/* import { getGraphData } from './helpers' */
import GraphDrawer from './GraphDrawer'
import Sidebar from './Sidebar'
import { Container, GraphContainer } from './styles'
// ---

import ReactFlow, { Background, isNode, Node as Node0, Edge as Edge0 } from 'react-flow-renderer'
import { Edge, Node, Graph, Highlight, Badge, Table, ChromaticScale } from './model'
import { DagNode } from './DagNode'
import { getLayoutedElements } from './layout'
import {
  resetHighlight,
  highlightNodesBatch,
  findChildNodes,
  findParentNodes,
  findNeighborNodes,
  expandNode,
  highlightNode,
  changeBadge,
} from './graph-ops'

const Graph2 = ({ data, enableGrouping /* , chromaticScale */ }: Props) => {
  /* TODO: We might not need that many states for drawer */
  const [drawerIsVisible, setDrawerVisibility] = useState<boolean>(false)
  const [drawerHeight, setDrawerHeight] = useState(500) // TODO: Could possibly be moved into drawers local state?
  const [drawerNodeId, setDrawerNodeId] = useState<string>('')
  const [drawerTable, setDrawerTable] = useState<string>('')

  const openDrawer = (id: string) => {
    setDrawerNodeId(id)
    setDrawerVisibility(true)

    const table = data.tables.find(table => table.id === id)
    table && setDrawerTable(table.name)
  }
  const drawerData = data.tables.find(table => table.id === drawerNodeId)

  const [graph, setGraph] = useState<Graph>({
    nodes: mapInitialNodes(data, openDrawer),
    edges: mapInitialEdges(data),
  })

  const [highlight, setHighlight] = useState<Highlight>('nearest')
  const [badge, setBadge] = useState<Badge>('violations')
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchError, setSearchError] = useState<boolean>(false)

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

    const nodesToHighlight =
      highlight === 'parents'
        ? findParentNodes(graph, element.id)
        : highlight === 'children'
        ? findChildNodes(graph, element.id)
        : findNeighborNodes(graph, element.id)

    const nodesToHighlight2 = nodesToHighlight.concat([element.id])
    setGraph(highlightNodesBatch(nodesToHighlight2))
  }

  const onPaneClick = () => setGraph(resetHighlight)
  const onElementExpand = (_: any, element: Node | Edge) =>
    enableGrouping && isNode(element) && setGraph(expandNode(element.id))

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
      />
      <div style={{ height: '100vh', width: '100%' }}>
        <ReactFlow
          nodesDraggable={false}
          onElementClick={onElementClick}
          onNodeDoubleClick={onElementExpand}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          elements={elements}
        >
          <Background />
        </ReactFlow>
      </div>
      {drawerData && (
        <GraphContainer>
          <GraphDrawer
            data={drawerData}
            drawerHeight={drawerHeight}
            setDrawerHeight={setDrawerHeight}
            table={drawerTable}
            setDrawerTable={setDrawerTable}
            visible={drawerIsVisible}
            setDrawerVisibility={setDrawerVisibility}
          />
        </GraphContainer>
      )}
    </Container>
  )
}

export default Graph2

interface Props {
  data: {
    tables: Table[]
  }
  enableGrouping: boolean

  // You can use any color scheme from https://github.com/d3/d3-scale-chromatic#sequential-single-hue
  // Pass the name of the scheme as chromaticScale prop (ex. 'interpolateBlues', 'interpolateGreens', etc.)
  chromaticScale?: ChromaticScale
}

const nodeTypes = {
  dagNode: DagNode,
}

const initialPosition = { x: 0, y: 0 }
const mapInitialNodes = (data: Props['data'], openDrawer: (_: string) => void): Node[] =>
  data.tables.map((table: Table) => ({
    id: table.id,
    data: {
      label: table.name,
      highlight: false,
      badge: 'violations',
      partitions: table.measures.rows,
      violations: table.measures.violations ?? 0,
      columns: table.columns.map(col => col.name),
      onTitleClick: openDrawer,
    },
    position: initialPosition,
    type: 'dagNode',
  }))

const mapInitialEdges = (data: Props['data']): Edge[] =>
  data.tables
    .filter((t: Table) => t.dependencies !== undefined)
    .reduce((acc: Edge[], table: Table) => {
      const items = table.dependencies!.map(dep => ({
        id: `el-${dep}`,
        source: table.id,
        target: dep,
      }))

      return [...acc, ...items]
    }, [])
