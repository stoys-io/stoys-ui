import React, { useRef, useEffect, useState, useMemo } from 'react'
import G6 from '@antv/g6'
import { createNodeFromReact } from '@antv/g6-react-node'
import { getGraphData } from './helpers'
import { appendAutoShapeListener } from './events'
import GraphDrawer from './GraphDrawer'
import CustomNode from './CustomNode'
import Sidebar from './Sidebar'
import { Container, GraphContainer } from './styles'
import { Badge, GraphProps, Highlight } from './model'

const Graph = ({ nodes, edges, combos }: GraphProps) => {
  const data = { nodes, edges, combos }
  const [drawerIsVisible, setDrawerVisibility] = useState(false)
  const [drawerNodeLabel, setDrawerNodeLabel] = useState('')
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
          nodesep: 30,
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
    setSelectedNodeId(searchedNodeId)
    graph.changeData(getGraphData({ data, selectedNodeId: searchedNodeId, badge }))
    graph.focusItem(searchedNodeId)
  }, [searchedNodeId])

  const onNodeClick = (node: any) => {
    setSelectedNodeId(node.id)
    setDrawerNodeLabel(node.label)
    graph.changeData(getGraphData({ data, selectedNodeId: node.id, badge }))
  }

  const openDrawer = (node: any, table: string) => {
    const model = node.getModel()
    setDrawerNodeLabel(model.label)
    setDrawerVisibility(true)
    setDrawerTable(table)
  }

  const onSearchNode = () => {
    if (searchInputValue) {
      const node = nodes.find(node => node.label.indexOf(searchInputValue) !== -1)
      if (node) {
        setSearchedNodeId(node.id)
      } else {
        setSearchHasError(true)
      }
    }
  }

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
