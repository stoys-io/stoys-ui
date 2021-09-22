import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
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
  const { data: { tables } = {}, chromaticScale } = props
  const nodes: Nodes =
    props.nodes ||
    tables!.map(table => ({
      id: table.id,
      label: table.name,
      columns: table.columns,
      violations: table.measures.violations,
      partitions: table.measures.rows,
      // TODO: add comboId
    }))
  const edgesObj: any = tables?.reduce((acc: any, table) => {
    table.dependencies?.forEach(dependency => (acc[dependency] = table.id))

    return acc
  }, {})
  const edges: Edges =
    props.edges ||
    Object.keys(edgesObj).map(source => ({
      id: `${source}-${edgesObj[source]}`,
      source,
      target: edgesObj[source],
    }))
  const combos: Combos = props.combos || []

  const data = { nodes, edges, combos }
  const [drawerIsVisible, setDrawerVisibility] = useState(false)
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
          nodesepFunc: (node: any) => {
            return 15 * node.columns?.length || 30
          },
          ranksep: 70,
        },
      })
    }
    graph.data(getData())
    graph.render()
    appendAutoShapeListener(graph)
  }

  const getData = useCallback(
    (args?: { selectedNodeId?: string }) =>
      getGraphData({
        data,
        selectedNodeId: args?.selectedNodeId || selectedNodeId,
        badge,
        highlight,
        chromaticScale,
      }),
    [data, badge, selectedNodeId, highlight]
  )

  useEffect(() => {
    initializeGraph()
    return () => {
      graph.destroy()
    }
  }, [badge, searchedNodeId, highlight])

  useEffect(() => {
    if (searchedNodeId) {
      setSelectedNodeId(searchedNodeId)
      graph.changeData(getData({ selectedNodeId: searchedNodeId }))

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
    setDrawerNodeId(node.id)
    graph.changeData(getData({ selectedNodeId: node.id }))
  }

  const openDrawer = (node: any, table: string) => {
    const model = node.getModel()
    setDrawerNodeId(model.id)
    setDrawerVisibility(true)
    setDrawerTable(table)
  }

  const onSearchNode = () => {
    if (searchInputValue) {
      const node = nodes.find(node => node.label.indexOf(searchInputValue) !== -1)
      if (searchHasError) {
        setSearchHasError(false)
      }
      if (!node) {
        return setSearchHasError(true)
      }
      setSearchedNodeId(node.id)
    }
  }

  const drawerData = useMemo(
    () => tables?.find(table => table.id === drawerNodeId),
    [tables, drawerNodeId]
  )

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
