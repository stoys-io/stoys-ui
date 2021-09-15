import React, { useRef, useEffect, useState, useMemo } from 'react'
import G6 from '@antv/g6'
import { createNodeFromReact } from '@antv/g6-react-node'
import { getGraphData } from './helpers'
import { appendAutoShapeListener } from './events'
import GraphDrawer from './GraphDrawer'
import CustomNode from './CustomNode'
import Sidebar from './Sidebar'
import { Container, GraphContainer } from './styles'
import { Badge, Combos, Edges, GraphProps, Highlight, Nodes } from './model'

const Graph = (props: GraphProps) => {
  const {
    data: { tables },
  } = props
  const nodes: Nodes = tables.map(table => ({
    id: table.id,
    label: table.name,
    columns: table.columns,
    // TODO: add violation, partitions, comboId
    // violation: table.violation,
    // partitions: table.partitions
  }))
  const columnsMaxLength = tables.reduce(
    (length, table) => (length > table.columns.length ? length : table.columns.length),
    0
  )
  const edgesObj: any = tables.reduce((acc: any, table) => {
    table.dependencies?.forEach(dependency => (acc[dependency] = table.id))

    return acc
  }, {})
  const edges: Edges = Object.keys(edgesObj).map(source => ({
    id: `${source}-${edgesObj[source]}`,
    source,
    target: edgesObj[source],
  }))
  const combos: Combos = []

  const data = { nodes, edges, combos }
  const [drawerIsVisible, setDrawerVisibility] = useState(false)
  const [drawerNodeLabel, setDrawerNodeLabel] = useState('')
  const [drawerNodeId, setDrawerNodeId] = useState('')
  const [drawerTable, setDrawerTable] = useState('')
  const [drawerHeight, setDrawerHeight] = useState(500)

  const [badge, setBadge] = useState<Badge>('violations')

  const [selectedNodeId, setSelectedNodeId] = useState<string>('')
  const [highlight, setHighlight] = useState<Highlight>('nearest')

  const [searchInputValue, setSearchInputValue] = useState<string>('')
  const [searchedNodeId, setSearchedNodeId] = useState('')
  const [searchHasError, setSearchHasError] = useState<boolean>(false)

  const graphRef = useRef(null)
  let graph: any = null

  const initializeGraph = () => {
    if (!graph) {
      G6.registerNode(
        'customNodeShape',
        createNodeFromReact(({ cfg }) => CustomNode({ cfg, openDrawer, onNodeClick }))
      )
      const minimap = new G6.Minimap({
        size: [235, 200],
        className: 'minimap',
      })
      graph = new G6.Graph({
        // @ts-ignore
        container: graphRef.current,
        width: document.documentElement.clientWidth - 250, // 250px - width of the left-hand sidebar
        height: document.documentElement.clientHeight,
        plugins: [minimap],
        workerEnabled: true,
        modes: {
          default: [
            'drag-canvas',
            'zoom-canvas',
            {
              type: 'collapse-expand-combo',
              relayout: false,
            },
            {
              type: 'tooltip',
              // @ts-ignore
              formatText(model) {
                return model.label
              },
              offset: 10,
            },
          ],
        },
        defaultNode: {
          type: 'customNodeShape',
        },
        defaultEdge: {
          type: 'line',
          lineWidth: 2,
          color: '#ccc',
        },
        defaultCombo: {
          // type: 'rect',
          collapsed: false,
          style: {
            fill: '#e1f1fb',
            stroke: '#ccc',
          },
        },
        layout: {
          type: 'dagre',
          rankdir: 'LR',
          nodesep: 8 * columnsMaxLength,
          ranksep: 70,
        },
      })
    }
    graph.data(graphData)
    graph.render()
    appendAutoShapeListener(graph)
  }

  const graphData = useMemo(
    () => getGraphData({ data, selectedNodeId, badge }),
    [badge, selectedNodeId]
  )

  useEffect(() => {
    initializeGraph()
    return () => {
      graph.destroy()
    }
  }, [badge, searchedNodeId])

  useEffect(() => {
    if (searchedNodeId) {
      setSelectedNodeId(searchedNodeId)
      graph.changeData(getGraphData({ data, selectedNodeId: searchedNodeId, badge }))

      // When we start searching one node after another we have an issue with the calculation
      // of the node position in the ViewController.focus
      // (@antv/g6-core/lib/graph/controller/view)
      // We need this timeout to be sure that graph is ready after initialization
      // and we can get proper coordinates of the node
      setTimeout(() => graph.focusItem(searchedNodeId), 0)
    }
  }, [searchedNodeId])

  const onNodeClick = (node: any) => {
    setSelectedNodeId(node.id)
    setDrawerNodeLabel(node.label)
    graph.changeData(getGraphData({ data, selectedNodeId: node.id, badge }))
  }

  const openDrawer = (node: any, table: string) => {
    const model = node.getModel()
    setDrawerNodeLabel(model.label)
    setDrawerNodeId(model.id)
    setDrawerVisibility(true)
    setDrawerTable(table)
  }

  const onSearchNode = () => {
    if (searchInputValue) {
      const node = nodes.find(node => node.label.indexOf(searchInputValue) !== -1)
      if (!node) {
        return setSearchHasError(true)
      }
      setSearchedNodeId(node.id)
    }
  }

  const drawerData = tables.find(table => table.id === drawerNodeId)

  return (
    <Container>
      <Sidebar
        drawerHeight={drawerIsVisible ? drawerHeight : 0}
        badge={badge}
        changeBadge={setBadge}
        searchInputValue={searchInputValue}
        setSearchInputValue={setSearchInputValue}
        onSearchNode={onSearchNode}
        searchHasError={searchHasError}
        highlight={highlight}
        setHighlight={setHighlight}
      />
      <GraphContainer>
        <div ref={graphRef} />
        <GraphDrawer
          data={drawerData}
          drawerHeight={drawerHeight}
          setDrawerHeight={setDrawerHeight}
          nodeLabel={drawerNodeLabel}
          table={drawerTable}
          setDrawerTable={setDrawerTable}
          visible={drawerIsVisible}
          setDrawerVisibility={setDrawerVisibility}
        />
      </GraphContainer>
    </Container>
  )
}

export default Graph
