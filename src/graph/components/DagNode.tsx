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
import { Column, NodeDataPayload, ColumnMetric, NodeColumnDataType } from '../model'
import { ItemContent, ItemText, ItemExtra, ScrollCard, ScrollCardTitle } from '../styles'
import {
  useGraphStore,
  GraphStore,
  setHighlightedColumns,
  openDrawer,
  useGraphDispatch,
} from '../graph-store'

const selectTableMetric = (state: GraphStore) => state.tableMetric
const selectColumnMetric = (state: GraphStore) => state.columnMetric
const selectHighlightMode = (state: GraphStore) => state.highlightMode

const selectTableId = (state: GraphStore) => state.highlightedColumns.selectedTableId
const selectColumnId = (state: GraphStore) => state.highlightedColumns.selectedColumnId
const selectRelColumnIds = (state: GraphStore) => state.highlightedColumns.relatedColumnsIds

export const DagNode = memo(
  ({
    id,
    data: { label, columns, violations, partitions },
    isConnectable,
    targetPosition,
    sourcePosition,
  }: NodeProps<NodeDataPayload>): JSX.Element => {
    const dispatch = useGraphDispatch()

    const style = useGraphStore(useCallback(state => state.highlights.nodes[id], [id]))
    const selectedTableId = useGraphStore(selectTableId)
    const selectedColumnId = useGraphStore(selectColumnId)
    const relatedColumnsIds = useGraphStore(selectRelColumnIds)
    const highlightMode = useGraphStore(selectHighlightMode)

    const columnMetric = useGraphStore(selectColumnMetric)
    const tableMetric = useGraphStore(selectTableMetric)
    const tableMetricValFormatted =
      tableMetric === 'none'
        ? null
        : tableMetric === 'violations'
        ? formatTableMetric(violations)
        : formatTableMetric(partitions)

    const _columns =
      selectedTableId && id !== selectedTableId
        ? columns.filter((column: Column) => relatedColumnsIds.includes(column.id))
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

    const cardHighlightedColor = style?.color ? style.color : GREY_ACCENT
    const titleHighlightColor =
      style && [ADDED_NODE_HIGHLIGHT_COLOR, DELETED_NODE_HIGHLIHT_COLOR].includes(style.color)
        ? style.color
        : RESET_COLOR

    const isHoverableColumn = !['none', 'diffing'].includes(highlightMode)

    return (
      <div className="nowheel">
        {/* nowheel enables scrolling */}
        {sourcePosition === 'top' ? (
          <Handle
            type="source"
            position={Position['Top']}
            style={handleStyleTop}
            isConnectable={isConnectable}
          />
        ) : (
          <Handle
            type="source"
            position={Position['Left']}
            style={handleStyleLeft}
            isConnectable={isConnectable}
          />
        )}
        <ScrollCard
          title={
            <ScrollCardTitle onClick={() => dispatch(openDrawer(id))} color={titleHighlightColor}>
              {label}
            </ScrollCardTitle>
          }
          size="small"
          type="inner"
          extra={tableMetricValFormatted}
          highlightColor={cardHighlightedColor}
        >
          <List
            size="small"
            dataSource={_columns}
            renderItem={(column: Column) => {
              const columnExtra = formatColumnExtra(column, columnMetric)
              const tooltip = `${column.name}: ${columnExtra}`

              return (
                <List.Item>
                  <ItemContent title={tooltip}>
                    <ItemText
                      hoverable={isHoverableColumn}
                      color={getListItemHighlightedColor(column)}
                      onClick={(evt: React.MouseEvent<HTMLElement>) => {
                        evt.stopPropagation()
                        dispatch(setHighlightedColumns(column.id, id))
                      }}
                    >
                      {column.name}
                    </ItemText>
                    <ItemExtra>{columnExtra}</ItemExtra>
                  </ItemContent>
                </List.Item>
              )
            }}
          />
        </ScrollCard>
        {targetPosition === 'bottom' ? (
          <Handle
            type="target"
            position={Position['Bottom']}
            style={handleStyleBottom}
            isConnectable={isConnectable}
          />
        ) : (
          <Handle
            type="target"
            position={Position['Right']}
            style={handleStyleRight}
            isConnectable={isConnectable}
          />
        )}
      </div>
    )
  }
)

const formatColumnExtra = (column: Column, columnMetric: ColumnMetric): string => {
  if (column.metrics === undefined) {
    return ''
  }

  if (columnMetric === 'data_type' && column.metrics[columnMetric] !== undefined) {
    return formatColumnDataType(column.metrics['data_type']!)
  }

  return formatColumnMetric(column.metrics[columnMetric] as string | number)
}

const fmt = renderNumericValue(2, true)
const formatTableMetric = (val: number) => fmt(val)
const formatColumnMetric = (val: number | string) => (typeof val === 'number' ? fmt(val) : val)

const formatColumnDataType = (data_type: NodeColumnDataType) =>
  `${data_type.type}${data_type.nullable ? '?' : ''}`

const handleStyleTop = { top: -3, background: '#555' }
const handleStyleLeft = { left: -3, background: '#555', zIndex: 1 }

const handleStyleBottom = { bottom: -3, background: '#555' }
const handleStyleRight = { right: -3, background: '#555' }
