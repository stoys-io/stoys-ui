import React from 'react'

import { Handle, NodeProps, Position } from 'react-flow-renderer'
import { NodeBody, NodeToolbar } from './styles'

export const DagNode = ({
  data: {
    label,
    controls: { onClick },
    highlight,
  },
  isConnectable,
}: NodeProps): JSX.Element => {
  return (
    <>
      <Handle
        type="target"
        position={Position['Top']}
        style={{ top: -3, background: '#555' }}
        isConnectable={isConnectable}
      />
      <NodeBody highlight={highlight}>
        <div>{label}</div>
        <NodeToolbar>
          <button onClick={onClick}>JR</button>
          <button onClick={onClick}>M</button>
          <button onClick={onClick}>P</button>
          <button onClick={onClick}>Q</button>
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
