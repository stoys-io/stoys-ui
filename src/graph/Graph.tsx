import React, { useRef, useEffect, useState } from 'react'
import G6 from '@antv/g6'
import { createNodeFromReact } from 'g6-react-node'
import { getData } from './helpers'
import { appendAutoShapeListener } from './events'
import GraphDrawer from './GraphDrawer'
import CustomNode from './CustomNode'
import { GraphContainer } from './styles'

const data = getData()

const Graph = () => {
  const [drawerIsVisible, setDrawerVisibility] = useState(false)
  const [drawerNodeLabel, setDrawerNodeLabel] = useState('')
  const [drawerTable, setDrawerTable] = useState('')
  const graphRef = useRef(null)
  let graph: any = null

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
        createNodeFromReact(({ cfg }) => CustomNode({ cfg, openDrawer }))
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
              type: 'activate-relations',
              trigger: 'click',
            },
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
        nodeStateStyles: {
          // FIXME not working as we use custom node
          active: {
            stroke: '#4363d8',
          },
        },
        defaultEdge: {
          type: 'line',
          lineWidth: 2,
          color: '#ccc',
        },
        edgeStateStyles: {
          inactive: {
            stroke: '#ccc',
          },
          active: {
            lineWidth: 4,
            stroke: '#ccc',
            shadowColor: '#ccc',
            shadowBlur: 8,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
          },
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

    graph.data(data)

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
