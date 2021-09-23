import React, { useState, useCallback, useMemo } from 'react'
/* import { getGraphData } from './helpers' */
/* import { appendAutoShapeListener } from './events' */
import GraphDrawer from './GraphDrawer'
/* import CustomNode from './CustomNode' */
import Sidebar from './Sidebar'
import { Container, GraphContainer } from './styles'
import { Badge, Combos, Edges, GraphProps, Highlight, Nodes } from './model'

// ---

import ReactFlow, { Background, isNode } from 'react-flow-renderer'
import { Edge, Node, Graph } from './model2'
import { DagNode } from './DagNode'
import { getLayoutedElements } from './layout'

const Graph2 = (props: Props) => {
  const {
    data,
    /* data: { tables } = {}, */
    /* , chromaticScale */
  } = props
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
  const [drawerIsVisible, setDrawerVisibility] = useState(false)
  const [drawerNodeId, setDrawerNodeId] = useState('')
  const [drawerTable, setDrawerTable] = useState('')
  const [drawerHeight, setDrawerHeight] = useState(500)

  const [badge, setBadge] = useState<Badge>('violations')

  /* const [selectedNodeId, setSelectedNodeId] = useState<string>('') */
  const [highlight, setHighlight] = useState<Highlight>('nearest')

  const [searchInputValue, setSearchInputValue] = useState<string>('')
  /* const [searchedNodeId, setSearchedNodeId] = useState('') */
  const [searchHasError, setSearchHasError] = useState<boolean>(false)

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

  /* const onSearchNode = () => {
   *   if (searchInputValue) {
   *     const node = nodes.find((node: any) => node.label.indexOf(searchInputValue) !== -1)
   *     if (searchHasError) {
   *       setSearchHasError(false)
   *     }
   *     if (!node) {
   *       return setSearchHasError(true)
   *     }
   *   }
   * } */

  /* const drawerData = useMemo(
   *   () => tables?.find((table: any) => table.id === drawerNodeId),
   *   [tables, drawerNodeId]
   * ) */

  // -----

  /* const initialNodes: Edge[] = edgesMock.map(edge => ({ ...edge, id: `el-${edge.id}` }))
   * const initialEdges: Node[] = nodesMock.map(node => ({
   *   id: node.id,
   *   data: {
   *     label: node.label,
   *     highlight: false,
   *     controls: { onClick: () => {} },
   *   },
   *   position: { x: 0, y: 0 },
   *   type: 'dagNode',
   * })) */

  const [graph, setGraph] = useState<Graph>({
    nodes: mapInitialNodes(data),
    edges: mapInitialEdges(data),
  })

  const elements = getLayoutedElements([...graph.nodes, ...graph.edges])
  return (
    <Container>
      <Sidebar
        drawerHeight={drawerIsVisible ? drawerHeight : 0}
        badge={badge}
        changeBadge={setBadge}
        searchInputValue={searchInputValue}
        setSearchInputValue={setSearchInputValue}
        onSearchNode={/* onSearchNode */ () => {}}
        searchHasError={searchHasError}
        highlight={highlight}
        setHighlight={setHighlight}
      />
      <div style={{ height: '100vh', width: '100%' }}>
        <ReactFlow
          nodesDraggable={true}
          onElementClick={/* onElementClick */ () => {}}
          onNodeDoubleClick={/* onElementExpand */ () => {}}
          onPaneClick={/* onPaneClick */ () => {}}
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
