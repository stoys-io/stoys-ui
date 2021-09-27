import React from 'react'
import { Handle, NodeProps, Position } from 'react-flow-renderer'
import List from 'antd/lib/list'

import { renderNumericValue } from '../helpers'
import { DataPayload } from './model'
import { ScrollCard } from './styles'

export const DagNode = ({
  id,
  data: { label, badge, columns, violations, partitions, highlight, onTitleClick },
  isConnectable,
}: NodeProps<DataPayload>): JSX.Element => {
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
        title={<div onClick={() => onTitleClick(id)}>{label}</div>}
        size="small"
        type="inner"
        extra={actualBadgeFormatted}
        highlight={highlight}
      >
        <List
          size="small"
          dataSource={columns}
          renderItem={column => <List.Item>{column}</List.Item>}
        />
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
