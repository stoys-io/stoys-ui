import React, { useState } from 'react'
import ReactFlow, { ReactFlowProvider, Background } from 'react-flow-renderer'
import { getLayoutedElements } from './layout'
import { DagNode } from './DagNode'

/* import { edges as edgesMock } from './Edges.mock'
 * import { nodes as nodesMock } from './Nodes.mock' */

const Dag = ({ data }: any) => {
  const nodes = data.tables.map((table: Table, i: number) => ({
    id: table.id,
    data: { label: table.name },
    position: initialPosition,
    type: 'dagNode',
  }))

  const edges = data.tables
    .filter((t: Table) => t.dependencies !== undefined)
    .reduce((acc: Edge[], table: Table) => {
      const items = table.dependencies!.map(dep => ({
        id: `el-${dep}`,
        source: table.id,
        target: dep,
      }))

      return [...acc, ...items]
    }, [])

  /* console.log('edges', edges) */
  const initialElements = [...nodes, ...edges]
  const layoutedEls = getLayoutedElements(initialElements)

  const [elements, _] = useState(layoutedEls)

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <ReactFlowProvider>
        <ReactFlow nodeTypes={nodeTypes} elements={elements}>
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  )
}

export { Dag }

const nodeTypes = {
  dagNode: DagNode,
}

const initialPosition = { x: 0, y: 0 }

interface Edge {
  id: string
  source: string
  target: string
}

interface Table {
  id: string
  name: string
  dependencies?: string[]
}
