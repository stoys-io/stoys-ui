import React from 'react'
import { Handle, NodeProps, Position } from 'react-flow-renderer'
import List from 'antd/lib/list'

import { renderNumericValue } from '../helpers'
import { ScrollCard } from './styles'

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
  const cardStyle = {}
  const data = [1, 2, 3]
  const actualBadge = badge === 'violations' ? violations : partitions
  const actualBadgeFormatted = renderNumericValue(2, true)(actualBadge)

  return (
    <div className="nowheel">
      {/* nowheel enables scrolling */}
      <Handle
        type="target"
        position={Position['Top']}
        style={{ top: -3, background: '#555' }}
        isConnectable={isConnectable}
      />
      <ScrollCard
        title={label}
        size="small"
        type="inner"
        style={cardStyle}
        extra={actualBadgeFormatted}
        expand={expand}
        highlight={highlight}
      >
        <List size="small" dataSource={data} renderItem={item => <List.Item>{item}</List.Item>} />
      </ScrollCard>
      <Handle
        type="source"
        position={Position['Bottom']}
        style={{ bottom: -3, background: '#555' }}
        isConnectable={isConnectable}
      />
    </div>
  )
}
