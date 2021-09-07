import React, { useRef, useEffect, useState, useMemo } from 'react'
import G6 from '@antv/g6'
import { createNodeFromReact } from '@antv/g6-react-node'
import { getData } from './helpers'
import { appendAutoShapeListener } from './events'
import GraphDrawer from './GraphDrawer'
import CustomNode from './CustomNode'
import Sidebar from './Sidebar'
import { Container, GraphContainer } from './styles'
import { Badge } from './model'

const Graph = () => {
  const [drawerIsVisible, setDrawerVisibility] = useState(false)
  const [drawerNodeLabel, setDrawerNodeLabel] = useState('')
  const [drawerTable, setDrawerTable] = useState('')
  const [badge, setBadge] = useState<Badge>('violations')
  const [selectedNodeId, setSelectedNodeId] = useState<string>('')
  const [searchNodeId, setSearchNodeId] = useState<string>('')
  const graphRef = useRef(null)
  let graph: any = null

  const graphData = useMemo(
    () => getData({ selectedNodeId, badge }),
    [getData, badge, selectedNodeId]
  )

  useEffect(() => {
    if (!graph) {
      G6.registerNode(
        'customNodeShape',
        createNodeFromReact(({ cfg }) => CustomNode({ cfg, openDrawer, onNodeClick }))
      )

      const minimap = new G6.Minimap({
        size: [250, 200],
        className: 'minimap',
        // type: 'delegate',
      })

      graph = new G6.Graph({
        // @ts-ignore
        container: graphRef.current,
        width: 1500,
        height: 900,
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

    return () => {
      graph.destroy()
    }
  }, [graph, badge])

  const onNodeClick = (node: any) => {
    setSelectedNodeId(node.id)
    setDrawerNodeLabel(node.label)
    graph.changeData(getData({ selectedNodeId: node.id, badge }))
  }

  const openDrawer = (node: any, table: string) => {
    const model = node.getModel()
    setDrawerNodeLabel(model.label)
    setDrawerVisibility(true)
    setDrawerTable(table)
  }

  const onSearchNode = (nodeId: string) => {
    console.log(nodeId, 'nodeId')
    console.log(graph, 'graph')
    // graph.focusItem(nodeId)
  }

  return (
    <Container>
      <Sidebar
        badge={badge}
        changeBadge={setBadge}
        searchNodeId={searchNodeId}
        setSearchNodeId={setSearchNodeId}
        onSearchNode={onSearchNode}
      />
      <GraphContainer>
        <div ref={graphRef} />
        <GraphDrawer
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
