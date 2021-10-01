import React, { memo } from 'react'
import { Handle, NodeProps, Position } from 'react-flow-renderer'
import List from 'antd/lib/list'

import { renderNumericValue } from '../helpers'
import { DataPayload } from './model'
import { ScrollCard } from './styles'

export const DagNode = memo(
  ({
    id,
    data: { label, badge, columns, violations, partitions, highlight, onTitleClick },
    isConnectable,
    targetPosition,
    sourcePosition,
  }: NodeProps<DataPayload>): JSX.Element => {
    const actualBadge = badge === 'violations' ? violations : partitions
    const actualBadgeFormatted = renderNumericValue(2, true)(actualBadge)

    return (
      <div className="nowheel">
        {/* nowheel enables scrolling */}
        {targetPosition === 'top' ? (
          <Handle
            type="target"
            position={Position['Top']}
            style={{ top: -3, background: '#555' }}
            isConnectable={isConnectable}
          />
        ) : (
          <Handle
            type="target"
            position={Position['Left']}
            style={{ left: -3, background: '#555', zIndex: 1 }}
            isConnectable={isConnectable}
          />
        )}
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
        {sourcePosition === 'bottom' ? (
          <Handle
            type="source"
            position={Position['Bottom']}
            style={{ bottom: -3, background: '#555' }}
            isConnectable={isConnectable}
          />
        ) : (
          <Handle
            type="source"
            position={Position['Right']}
            style={{ right: -3, background: '#555' }}
            isConnectable={isConnectable}
          />
        )}
      </div>
    )
  }
)
