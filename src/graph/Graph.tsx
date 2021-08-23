import React, { useRef, useState } from 'react'
import { Menu } from 'antd'
import Graphin, { Behaviors, IUserNode, GraphEvent } from '@antv/graphin'
import { MiniMap, ContextMenu } from '@antv/graphin-components'
import GraphDrawer from './GraphDrawer'
import { GraphContainer } from './styles'
import { getData } from './helpers'

const { ActivateRelations } = Behaviors

const Graph = () => {
  const graphRef = useRef<Graphin>(null)
  const [selectedNode, setSelectedNode] = useState<IUserNode>()
  const [drawerIsVisible, setDrawerVisibility] = useState(false)

  React.useEffect(() => {
    if (graphRef?.current) {
      const { graph } = graphRef?.current
      const onNodeClick = (e: GraphEvent) => {
        setSelectedNode(e.item.get('model'))
        setDrawerVisibility(true)
      }
      graph.on('node:click', onNodeClick)
      return () => {
        graph.off('node:click', onNodeClick)
      }
    }
  }, [])

  return (
    <GraphContainer>
      <Graphin
        data={getData()}
        ref={graphRef}
        layout={{
          type: 'dagre',
          rankdir: 'LR',
          nodesep: 10,
          ranksep: 50,
        }}
        // options={{
        //   renderer: 'svg'
        // }}
        width={2000}
        height={900}
        defaultNode={{
          type: 'rect',
        }}
        defaultCombo={{
          // FIXME collapsed doesn't work
          collapsed: true,
          style: {
            lineWidth: 3,
            fill: '#f8f8f8',
          },
        }}
        defaultEdge={{
          style: {
            keyshape: {
              stroke: '#ccc',
              lineWidth: 2,
            },
            label: {},
            halo: {},
            status: {
              inactive: {
                keyshape: {
                  stroke: '#000000',
                },
              },
            },
          },
        }}
        modes={{
          default: [
            'drag-canvas',
            'zoom-canvas',
            'collapse-expand-combo',
            { type: 'tooltip', offset: 10 },
          ],
        }}
      >
        <MiniMap
          visible
          // options={{ size: [ 400, 300] }}
          style={{ top: '0px', bottom: 'unset' }}
        />
        <ContextMenu>
          <Menu>
            <Menu.Item key="1">Option 1</Menu.Item>
            <Menu.Item key="2">Option 2</Menu.Item>
          </Menu>
        </ContextMenu>
        <ActivateRelations trigger="onclick" />
      </Graphin>

      <GraphDrawer
        visible={drawerIsVisible}
        setDrawerVisibility={setDrawerVisibility}
        selectedNode={selectedNode}
      />
    </GraphContainer>
  )
}

export default Graph
