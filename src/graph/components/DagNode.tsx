import React, { memo, useCallback } from 'react'
import { Handle, NodeProps, Position } from 'react-flow-renderer'
import List from 'antd/lib/list'

import {
  ADDED_NODE_HIGHLIGHT_COLOR,
  RESET_COLOR,
  DELETED_NODE_HIGHLIHT_COLOR,
  NODE_TEXT_COLOR,
  TRANSPARENT_NODE_TEXT_COLOR,
  GREY_ACCENT,
} from '../constants'
import { renderNumericValue } from '../../helpers'
import { Column, DataPayload } from '../model'
import { DagListItem, ScrollCard, ScrollCardTitle } from '../styles'
import { useGraphStore, GraphStore } from '../graph-store'

const selectBadge = (state: GraphStore) => state.badge
const selectColumns = (state: GraphStore) => state.setHighlightedColumns
const selectTableId = (state: GraphStore) => state.highlightedColumns.selectedTableId
const selectColumnId = (state: GraphStore) => state.highlightedColumns.selectedColumnId
const selectRelColumnIds = (state: GraphStore) => state.highlightedColumns.reletedColumnsIds
const selecthighlightedType = (state: GraphStore) => state.highlightedColumns.highlightedType
const selectOpenDrawer = (state: GraphStore) => state.openDrawer

export const DagNode = memo(
  ({
    id,
    data: { label, columns, violations, partitions },
    isConnectable,
    targetPosition,
    sourcePosition,
  }: NodeProps<DataPayload>): JSX.Element => {
    const badge = useGraphStore(selectBadge)
    const style = useGraphStore(useCallback(state => state.highlights.nodes[id], [id]))

    const setHighlightedColumns = useGraphStore(selectColumns)
    const selectedTableId = useGraphStore(selectTableId)
    const selectedColumnId = useGraphStore(selectColumnId)
    const reletedColumnsIds = useGraphStore(selectRelColumnIds)
    const highlightedType = useGraphStore(selecthighlightedType)

    const openDrawer = useGraphStore(selectOpenDrawer)

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

      return RESET_COLOR
    }

    const cardHighlightedColor = (): string => (style?.color ? style.color : GREY_ACCENT)

    const titleHighlightColor = (): string => {
      if (
        style?.color === ADDED_NODE_HIGHLIGHT_COLOR ||
        style?.color === DELETED_NODE_HIGHLIHT_COLOR
      ) {
        return style.color
      }

      return RESET_COLOR
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
            <ScrollCardTitle onClick={() => openDrawer(id)} color={titleHighlightColor()}>
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
