/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import ReactFlow, { ReactFlowProvider } from 'react-flow-renderer'
import { getLayoutedElements } from './layout'

const position = { x: 0, y: 0 }
const initialElements = [
  {
    id: '1',
    type: 'input',
    data: { label: 'input' },
    position,
  },
  {
    id: '2',
    data: { label: 'node 2' },
    position,
  },
  {
    id: '2a',
    data: { label: 'node 2a' },
    position,
  },
  {
    id: '2b',
    data: { label: 'node 2b' },
    position,
  },
  {
    id: '2c',
    data: { label: 'node 2c' },
    position,
  },
  {
    id: '2d',
    data: { label: 'node 2d' },
    position,
  },
  {
    id: '3',
    data: { label: 'node 3' },
    position,
  },
  {
    id: '4',
    data: { label: 'node 4' },
    position,
  },
  {
    id: '5',
    data: { label: 'node 5' },
    position,
  },
  {
    id: '6',
    type: 'output',
    data: { label: 'output' },
    position,
  },
  { id: '7', type: 'output', data: { label: 'output' }, position },
  { id: 'e12', source: '1', target: '2' },
  { id: 'e13', source: '1', target: '3' },
  { id: 'e22a', source: '2', target: '2a' },
  { id: 'e22b', source: '2', target: '2b' },
  { id: 'e22c', source: '2', target: '2c' },
  { id: 'e2c2d', source: '2c', target: '2d' },
  { id: 'e45', source: '4', target: '5' },
  { id: 'e56', source: '5', target: '6' },
  { id: 'e57', source: '5', target: '7' },
]

const layoutedElements = getLayoutedElements(initialElements)

const LayoutFlow = () => {
  const [elements, _] = useState(layoutedElements)

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <ReactFlowProvider>
        <ReactFlow elements={elements} />
      </ReactFlowProvider>
    </div>
  )
}

export default LayoutFlow
