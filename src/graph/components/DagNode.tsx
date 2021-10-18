import React, { useContext, memo } from 'react'
import { Handle, NodeProps, Position } from 'react-flow-renderer'
import List from 'antd/lib/list'

import HighlightedColumnsContext from '../columnsHighlightContext'

import {
  ADDED_NODE_HIGHLIGHT_COLOR,
  DEFAULT_COLOR,
  DELETED_NODE_HIGHLIHT_COLOR,
  NODE_TEXT_COLOR,
  TRANSPARENT_NODE_TEXT_COLOR,
} from '../constants'
import { renderNumericValue } from '../../helpers'
import { Column, DataPayload } from '../model'
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

    const {
      selectedTableId,
      selectedColumnId,
      reletedColumnsIds,
      setHighlightedColumns,
      highlightedType,
    } = useContext(HighlightedColumnsContext)

    const actualBadge = badge === 'violations' ? violations : partitions
    const actualBadgeFormatted = renderNumericValue(2, true)(actualBadge)
    const _columns =
      highlightedType !== 'none' &&
      highlightedType !== 'diffing' &&
      selectedTableId &&
      id !== selectedTableId
        ? columns.filter((column: any) => reletedColumnsIds.includes(column.id))
        : columns

    const getListItemHighlightedColor = (column: Column): string => {
      if (id === selectedTableId && column.id === selectedColumnId) {
        return NODE_TEXT_COLOR
      }

      if (id === selectedTableId) {
        return TRANSPARENT_NODE_TEXT_COLOR
      }

      if (
        style?.color === ADDED_NODE_HIGHLIGHT_COLOR ||
        style?.color === DELETED_NODE_HIGHLIHT_COLOR
      ) {
        return style.color
      }

      if (column?.style?.color) {
        return column.style.color
      }

      return DEFAULT_COLOR
    }

    const cardHighlightedColor = (): string => (style?.color ? style.color : '#808080')

    const titleHighlightColor = (): string => {
      if (
        style?.color === ADDED_NODE_HIGHLIGHT_COLOR ||
        style?.color === DELETED_NODE_HIGHLIHT_COLOR
      ) {
        return style.color
      }

      return DEFAULT_COLOR
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
          title={
            <ScrollCardTitle onClick={() => onTitleClick(id)} color={titleHighlightColor()}>
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
            renderItem={(column: Column) => (
              <DagListItem
                higtlightedColor={getListItemHighlightedColor(column)}
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
