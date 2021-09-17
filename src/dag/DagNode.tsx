import React from 'react'

import { Handle, NodeProps, Position } from 'react-flow-renderer'
import { NodeBody, NodeToolbar } from './styles'

export const DagNode = ({ data, isConnectable }: NodeProps): JSX.Element => {
  return (
    <>
      <Handle
        type="target"
        position={Position['Top']}
        style={{ top: -3, background: '#555' }}
        isConnectable={isConnectable}
      />
      <NodeBody>
        <div>{data.label}</div>
        <NodeToolbar>
          <button>JR</button>
          <button>M</button>
          <button>P</button>
          <button>Q</button>
        </NodeToolbar>
      </NodeBody>
      <Handle
        type="source"
        position={Position['Bottom']}
        style={{ bottom: -3, background: '#555' }}
        isConnectable={isConnectable}
      />
    </>
  )
}
