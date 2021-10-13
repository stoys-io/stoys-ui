import React, { useContext, memo } from 'react'
import { Handle, NodeProps, Position } from 'react-flow-renderer'
import List from 'antd/lib/list'

import HighlightedColumnsContext from '../columnsHighlightContext'

import { renderNumericValue } from '../../helpers'
import { DataPayload } from '../model'
import { DagListItem, ScrollCard, ScrollCardTitle } from '../styles'
import { useGraphStore } from '../graph-store'

export const DagNode = memo(
  ({
    id,
    data: { label, badge, columns, violations, partitions, onTitleClick },
    isConnectable,
    targetPosition,
    sourcePosition,
  }: NodeProps<DataPayload>): JSX.Element => {
    const style = useGraphStore(state => state.highlights.nodes[id])

    const { selectedTableId, selectedColumnId, reletedColumnsIds, setHighlightedColumns } =
      useContext(HighlightedColumnsContext)

    const actualBadge = badge === 'violations' ? violations : partitions
    const actualBadgeFormatted = renderNumericValue(2, true)(actualBadge)
    const _columns =
      selectedTableId && id !== selectedTableId
        ? columns.filter(column => reletedColumnsIds.includes(column.id))
        : columns

    const getListItemHighlightedColor = (columnId: string): string => {
      if (id === selectedTableId && columnId === selectedColumnId) {
        return 'rgb(0, 0, 0)'
      }

      if (id === selectedTableId) {
        return 'rgba(0, 0, 0, 0.4)'
      }

      return style?.color ? style.color : 'inherit'
    }

    const cardHighlightedColor = (): string => (style?.color ? style.color : '#808080')

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
          title={
            <ScrollCardTitle
              onClick={() => onTitleClick(id)}
              color={style?.color ? style.color : 'inherit'}
            >
              {label}
            </ScrollCardTitle>
          }
          size="small"
          type="inner"
          extra={actualBadgeFormatted}
          highlightColor={cardHighlightedColor()}
        >
          <List
            size="small"
            dataSource={_columns}
            renderItem={column => (
              <DagListItem
                higtlightedColor={getListItemHighlightedColor(column.id)}
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
