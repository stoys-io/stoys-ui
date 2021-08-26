import React, { useRef, useEffect, useState } from 'react'
import G6 from '@antv/g6'
import { Rect, Text, Group, createNodeFromReact } from 'g6-react-node'
import { getData, getLabelText } from './helpers'
import { appendAutoShapeListener } from './events'
import GraphDrawer from './GraphDrawer'
import { GraphContainer } from './styles'

const data = getData()

const Graph = () => {
  const [drawerIsVisible, setDrawerVisibility] = useState(false)
  const graphRef = useRef(null)
  let graph: any = null

  const CustomNode = ({ cfg }: { cfg: any }) => {
    const { label } = cfg
    return (
      <Group>
        <Rect
          style={{
            width: 150,
            maxWidth: 150,
            height: 'auto',
            fill: '#fff',
            stroke: '#ddd',
            shadowColor: '#eee',
            shadowBlur: 30,
            radius: [4],
            padding: [8],
            cursor: 'pointer',
          }}
          onClick={(evt, node, shape, graph) => {
            setDrawerVisibility(true)
          }}
        >
          <Text
            style={{
              fill: '#000',
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            {getLabelText(label)}
          </Text>
        </Rect>
      </Group>
    )
  }

  useEffect(() => {
    if (!graph) {
      G6.registerNode('customNodeShape', createNodeFromReact(CustomNode))

      const minimap = new G6.Minimap({
        // size: [100, 100],
        className: 'minimap',
        // type: 'delegate',
      })

      graph = new G6.Graph({
        // @ts-ignore
        container: graphRef.current,
        width: 1200,
        height: 600,
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
          size: [150, 50],
          labelCfg: {
            style: {
              fill: '#000000A6',
              fontSize: 10,
            },
          },
          style: {
            stroke: '#72CC4A',
            width: 150,
            height: 30,
          },
        },
        defaultEdge: {
          type: 'line',
          size: 1,
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
        // nodeStateStyles: {
        //   active: {
        //     stroke: 'red',
        //     lineWidth: 3
        //   }
        // },
        // edgeStateStyles: {
        //   hover: {
        //     stroke: 'blue',
        //     lineWidth: 3
        //   }
        // }
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
      <GraphDrawer visible={drawerIsVisible} setDrawerVisibility={setDrawerVisibility} />
    </GraphContainer>
  )
}

export default Graph
