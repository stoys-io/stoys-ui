import React, { useState } from 'react'
/* import { getGraphData } from './helpers' */
import GraphDrawer from './GraphDrawer'
import Sidebar from './Sidebar'
import { Container, GraphContainer } from './styles'
// ---

import ReactFlow, { Background, isNode } from 'react-flow-renderer'
import { Edge, Node, Graph, Highlight, Badge } from './model2'
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
  /* const nodes: Nodes =
                                                                                       *   props.nodes ||
                                                                                       *   tables!.map(table => ({
                                                                                       *     id: table.id,
                                                                                       *     label: table.name,
                                                                                       *     columns: table.columns,
                                                                                       *     violations: table.measures.violations,
                                                                                       *     partitions: table.measures.rows,
                                                                                       *     // TODO: add comboId
                                                                                       *   }))

                                                                                       * const edgesObj: any = tables?.reduce((acc: any, table) => {
                                                                                       *   table.dependencies?.forEach((dependency: any) => (acc[dependency] = table.id))

                                                                                       *   return acc
                                                                                       * }, {})
                                                                                       * const edges: Edges =
                                                                                       *   props.edges ||
                                                                                       *   Object.keys(edgesObj).map(source => ({
                                                                                       *     id: `${source}-${edgesObj[source]}`,
                                                                                       *     source,
                                                                                       *     target: edgesObj[source],
                                                                                       *   })) */

  /* const combos: Combos = props.combos || [] */

  /* const data = { nodes, edges, combos } */

  /* const [selectedNodeId, setSelectedNodeId] = useState<string>('') */

  /* const [searchedNodeId, setSearchedNodeId] = useState('') */

  // -----

  const [graph, setGraph] = useState<Graph>({
    nodes: mapInitialNodes(data),
    edges: mapInitialEdges(data),
  })
  const [highlight, setHighlight] = useState<Highlight>('nearest')
  const [badge, setBadge] = useState<Badge>('violations')
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchError, setSearchError] = useState<boolean>(false)

  const [drawerIsVisible, setDrawerVisibility] = useState(false)
  const [drawerNodeId, setDrawerNodeId] = useState('')
  const [drawerTable, setDrawerTable] = useState('')
  const [drawerHeight, setDrawerHeight] = useState(500)

  /* const onNodeClick = (node: any) => {
   *   setSelectedNodeId(node.id)
   *   setDrawerNodeId(node.id)
   *   graph.changeData(getData({ selectedNodeId: node.id }))
   * } */

  /* const openDrawer = (node: any, table: string) => {
   *   const model = node.getModel()
   *   setDrawerNodeId(model.id)
   *   setDrawerVisibility(true)
   *   setDrawerTable(table)
   * } */

  /* const drawerData = useMemo(
   *   () => tables?.find((table: any) => table.id === drawerNodeId),
   *   [tables, drawerNodeId]
   * ) */

  const onBadgeChange = (value: Badge) => {
    setBadge(value)
    setGraph(changeBadge(value))
  }

  const onHighlightChange = (value: Highlight) => {
    setGraph(resetHighlight)
    setHighlight(value)
  }

  const onElementClick = (_: any, element: Node | Edge) => {
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
      <GraphContainer>
        <GraphDrawer
          data={
            /* drawerData */
            {
              id: '1',
              name: 'a',
              columns: [],
              measures: {
                rows: 1,
              },
            }
          }
          drawerHeight={drawerHeight}
          setDrawerHeight={setDrawerHeight}
          table={drawerTable}
          setDrawerTable={setDrawerTable}
          visible={drawerIsVisible}
          setDrawerVisibility={setDrawerVisibility}
        />
      </GraphContainer>
    </Container>
  )
}

export default Graph2

interface Props {
  data: {
    tables: Table[]
  }
  enableGrouping: boolean
}

interface Table {
  id: string
  name: string
  measures: {
    rows: number
    violations?: number
  }
  dependencies?: string[]
  comboId?: string
}

const nodeTypes = {
  dagNode: DagNode,
}

const initialPosition = { x: 0, y: 0 }

const nodeControls = {
  onClick: () => console.log('Open drawer'),
}

const mapInitialNodes = (data: Props['data']): Node[] =>
  data.tables.map((table: Table) => ({
    id: table.id,
    data: {
      label: table.name,
      controls: nodeControls,
      highlight: false,
      badge: 'violations',
      partitions: table.measures.rows,
      violations: table.measures.violations ?? 0,
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
