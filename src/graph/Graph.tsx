import React, { useRef, useEffect, useState } from 'react'
import G6 from '@antv/g6'
import { createNodeFromReact } from '@antv/g6-react-node'
import { getData } from './helpers'
import { appendAutoShapeListener } from './events'
import GraphDrawer from './GraphDrawer'
import CustomNode from './CustomNode'
import { GraphContainer } from './styles'

const graphData = getData()

const Graph = () => {
  const [drawerIsVisible, setDrawerVisibility] = useState(false)
  const [drawerNodeLabel, setDrawerNodeLabel] = useState('')
  const [drawerTable, setDrawerTable] = useState('')
  const graphRef = useRef(null)
  let graph: any = null

  const onNodeClick = (nodeId: string) => {
    graph.changeData(getData(nodeId))
  }

  const openDrawer = (node: any, table: string) => {
    const model = node.getModel()
    setDrawerNodeLabel(model.label)
    setDrawerVisibility(true)
    setDrawerTable(table)
  }

  useEffect(() => {
    if (!graph) {
      G6.registerNode(
        'customNodeShape',
        createNodeFromReact(({ cfg }) => CustomNode({ cfg, openDrawer, onNodeClick }))
      )

      const minimap = new G6.Minimap({
        size: [300, 200],
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
            fill: '#c6eee3',
            stroke: '#C4E3B2',
          },
        },
        layout: {
          type: 'dagre',
          rankdir: 'LR',
          nodesep: 10,
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
  }, [])

  return (
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
  )
}

export default Graph
