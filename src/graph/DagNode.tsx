import React from 'react'
import { Handle, NodeProps, Position } from 'react-flow-renderer'
import List from 'antd/lib/list'

import { renderNumericValue } from '../helpers'
import { DataPayload } from './model'
import { DagListItem, ScrollCard } from './styles'

export const DagNode = ({
  id,
  data: {
    label,
    badge,
    columns,
    violations,
    partitions,
    highlight,
    onTitleClick,
    onListItemClick,
    highlightedColumns,
  },
  isConnectable,
}: NodeProps<DataPayload>): JSX.Element => {
  const actualBadge = badge === 'violations' ? violations : partitions
  const actualBadgeFormatted = renderNumericValue(2, true)(actualBadge)
  const _columns = highlightedColumns?.reletedTablesIds.includes(id)
    ? columns.filter(column => highlightedColumns?.reletedColumnsIds.includes(column.id))
    : columns

  const getHighlightedColor = (columnId: string): string => {
    if (
      id === highlightedColumns?.selectedTableId &&
      columnId === highlightedColumns?.selectedColumnId
    ) {
      return 'rgb(0, 0, 0)'
    }

    if (id === highlightedColumns?.selectedTableId) {
      return 'rgba(0, 0, 0, 0.4)'
    }

    return 'inherit'
  }

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
          dataSource={_columns}
          renderItem={column => (
            <DagListItem
              higtlightedColor={getHighlightedColor(column.id)}
              onClick={() => {
                onListItemClick(column.id, id)
              }}
            >
              {column.name}
            </DagListItem>
          )}
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
