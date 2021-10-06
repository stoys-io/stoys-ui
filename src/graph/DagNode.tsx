import React, { useContext, memo } from 'react'
import { Handle, NodeProps, Position } from 'react-flow-renderer'
import List from 'antd/lib/list'

import HighlightedColumnsContext from './columnsHighlightContext'

import { renderNumericValue } from '../helpers'
import { DataPayload } from './model'
import { DagListItem, ScrollCard } from './styles'

export const DagNode = memo(
  ({
    id,
    data: { label, badge, columns, violations, partitions, highlight, onTitleClick },
    isConnectable,
    targetPosition,
    sourcePosition,
  }: NodeProps<DataPayload>): JSX.Element => {
    const { selectedTableId, selectedColumnId, reletedColumnsIds, setHighlightedColumns } =
      useContext(HighlightedColumnsContext)

    const actualBadge = badge === 'violations' ? violations : partitions
    const actualBadgeFormatted = renderNumericValue(2, true)(actualBadge)
    const _columns =
      selectedTableId && id !== selectedTableId
        ? columns.filter(column => reletedColumnsIds.includes(column.id))
        : columns

    const getHighlightedColor = (columnId: string): string => {
      if (id === selectedTableId && columnId === selectedColumnId) {
        return 'rgb(0, 0, 0)'
      }

      if (id === selectedTableId) {
        return 'rgba(0, 0, 0, 0.4)'
      }

      return 'inherit'
    }

    return (
      <div className="nowheel">
        {/* nowheel enables scrolling */}
        {sourcePosition === 'top' ? (
          <Handle
            type="source"
            position={Position['Top']}
            style={{ top: -3, background: '#555' }}
            isConnectable={isConnectable}
          />
        ) : (
          <Handle
            type="source"
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
            dataSource={_columns}
            renderItem={column => (
              <DagListItem
                higtlightedColor={getHighlightedColor(column.id)}
                onClick={() => {
                  setHighlightedColumns(column.id, id)
                }}
              >
                {column.name}
              </DagListItem>
            )}
          />
        </ScrollCard>
        {targetPosition === 'bottom' ? (
          <Handle
            type="target"
            position={Position['Bottom']}
            style={{ bottom: -3, background: '#555' }}
            isConnectable={isConnectable}
          />
        ) : (
          <Handle
            type="target"
            position={Position['Right']}
            style={{ right: -3, background: '#555' }}
            isConnectable={isConnectable}
          />
        )}
      </div>
    )
  }
)
