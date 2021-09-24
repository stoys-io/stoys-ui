import React from 'react'
import { Handle, NodeProps, Position } from 'react-flow-renderer'

import Card from 'antd/lib/card'
import 'antd/lib/card/style/css'

import List from 'antd/lib/list'
import 'antd/lib/list/style/css'

import { NODE_HEIGHT, NODE_WIDTH, NODE_HEIGHT2, NODE_WIDTH2 } from './constants'
import { renderNumericValue } from '../helpers'

export const DagNode = ({
  data: {
    label,
    badge,
    violations,
    partitions,
    controls: { onClick },
    highlight,
    expand,
  },
  isConnectable,
}: NodeProps): JSX.Element => {
  const cardStyle = {
    width: expand ? NODE_WIDTH2 : NODE_WIDTH,
    height: expand ? NODE_HEIGHT2 : NODE_HEIGHT,
    border: `2px solid ${highlight ? 'green' : 'magenta'}`,
    borderRadius: '5px',
  }
  const data = [1, 2, 3]
  const actualBadge = badge === 'violations' ? violations : partitions
  const actualBadgeFormatted = renderNumericValue(2, true)(actualBadge)

  return (
    <>
      <Handle
        type="target"
        position={Position['Top']}
        style={{ top: -3, background: '#555' }}
        isConnectable={isConnectable}
      />
      <Card title={label} size="small" type="inner" style={cardStyle} extra={actualBadgeFormatted}>
        <List size="small" dataSource={data} renderItem={item => <List.Item>{item}</List.Item>} />
      </Card>
      <Handle
        type="source"
        position={Position['Bottom']}
        style={{ bottom: -3, background: '#555' }}
        isConnectable={isConnectable}
      />
    </>
  )
}
