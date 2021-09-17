import React, { useState } from 'react'
import ReactFlow, { ReactFlowProvider, Background, isNode, Node, Edge } from 'react-flow-renderer'
import { getLayoutedElements } from './layout'
import { DagNode } from './DagNode'
import { Wrap } from './styles'

import { edges as edgesMock } from './Edges.mock'
import { nodes as nodesMock } from './Nodes.mock'

interface MockData {
  edges: Array<{ id: string; source: string; target: string }>
  nodes: Array<{ id: string; label: string }>
}

const transformMockElements = ({ edges, nodes }: MockData): Array<Node | Edge> => {
  const newEdges: Edge[] = edges.map(edge => ({ ...edge, id: `el-${edge.id}` }))
  const newNodes: Node[] = nodes.map(node => ({
    id: node.id,
    data: { label: node.label },
    position: initialPosition,
    type: 'dagNode',
  }))

  return [...newEdges, ...newNodes]
}

const Dag = ({ data }: any) => {
  /* const nodes = data.tables.map((table: Table, i: number) => ({
*   id: table.id,
*   data: { label: table.name },
*   position: initialPosition,
*   type: 'dagNode',
* }))

* const edges = data.tables
*   .filter((t: Table) => t.dependencies !== undefined)
*   .reduce((acc: Edge[], table: Table) => {
*     const items = table.dependencies!.map(dep => ({
*       id: `el-${dep}`,
*       source: table.id,
*       target: dep,
*     }))

*     return [...acc, ...items]
*   }, [])
* const initialElements = [...nodes, ...edges] */

  const initialElements = transformMockElements({ edges: edgesMock, nodes: nodesMock })
  const layoutedEls = getLayoutedElements(initialElements)

  const [elements, _] = useState(layoutedEls)
  const [showWrap, setShowWrap] = useState<boolean>(false)

  const onElementClick = (event: React.MouseEvent<Element, MouseEvent>, element: Node | Edge) =>
    isNode(element) && setShowWrap(!showWrap) && console.log('click', element)

  return (
    <div style={{ height: '900px', width: '1600px' }}>
      <ReactFlow
        nodesDraggable={true}
        onElementClick={onElementClick}
        nodeTypes={nodeTypes}
        elements={elements}
      >
        <Background />
        {showWrap && <Wrap />}
      </ReactFlow>
    </div>
  )
}

export { Dag }

const nodeTypes = {
  dagNode: DagNode,
}

const initialPosition = { x: 0, y: 0 }

interface Table {
  id: string
  name: string
  dependencies?: string[]
}
