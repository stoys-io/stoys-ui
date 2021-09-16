import React from 'react'

import { Handle, NodeProps, Position } from 'react-flow-renderer'

export const DagNode = ({ data, isConnectable }: NodeProps): JSX.Element => {
  return (
    <>
      <Handle
        type="target"
        position={Position['Top']}
        style={{ background: '#555' }}
        onConnect={params => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div>{data.label}</div>
      <Handle
        type="source"
        position={Position['Bottom']}
        id="a"
        style={{ bottom: 10, background: '#555' }}
        isConnectable={isConnectable}
      />
    </>
  )
}
