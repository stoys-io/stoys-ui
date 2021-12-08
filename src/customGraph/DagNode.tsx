// TODO: Remove type guards. Metric types should be well defined

import React, { memo, useCallback } from 'react'
import List from 'antd/lib/list'

import {
  ADDED_NODE_HIGHLIGHT_COLOR,
  RESET_COLOR,
  DELETED_NODE_HIGHLIHT_COLOR,
  NODE_TEXT_COLOR,
  TRANSPARENT_NODE_TEXT_COLOR,
  GREY_ACCENT,
} from '../graph/constants'

import { formatPercentage, renderNumericValue } from '../helpers'
import { Column, NodeDataPayload, ColumnMetric, NodeColumnDataType } from '../graph/model'
import { ItemContent, ItemText, ItemExtra, ScrollCard, ScrollCardTitle } from '../graph/styles'
import {
  useGraphStore,
  GraphStore,
  setHighlightedColumns,
  useGraphDispatch,
} from '../graph/graph-store'
import { getMetricsColumnColor } from '../graph/graph-ops'

interface Props {
  id: string
  data: NodeDataPayload
  onClick: (id: string) => void
  onDoubleClick: (id: string) => void
}

export const DagNode = memo(
  ({
    id,
    data: { label, columns, violations, partitions },
    onClick,
    onDoubleClick,
  }: Props): JSX.Element => {
    const dispatch = useGraphDispatch()

    const style = useGraphStore(useCallback(state => state.highlights.nodes[id], [id]))
    const columnMetricMaxValue = useGraphStore(state => state.columnMetricMaxValue)
    const countNormalize = useGraphStore(state => state.countNormalize)

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

    const columnMaxCount = (metric: ColumnMetric) => {
      if (!metric.startsWith('count_') || metric === 'none' || metric === 'data_type') {
        return 1
      }

      const allValues = _columns.map(column => {
        const tmp = column.metrics?.[metric] ?? 1
        const v = typeof tmp !== 'string' ? tmp : !isNaN(+tmp) ? +tmp : 1

        return v
      })
      return Math.max(...allValues, 1)
    }

    const columnColorCountNormalizedMetrics = (column: Column): string => {
      if (columnMetricMaxValue === 0) {
        return RESET_COLOR
      }

      if (columnMetric === 'none' || columnMetric === 'data_type') {
        return RESET_COLOR
      }

      const tmp = column.metrics?.[columnMetric] ?? 0
      const count = typeof tmp !== 'string' ? tmp : !isNaN(+tmp) ? +tmp : 0

      const totalCount = columnMaxCount(columnMetric)
      const normalized = count / totalCount

      return getMetricsColumnColor(normalized)
    }

    const columnColorMetrics = (column: Column): string => {
      if (columnMetricMaxValue === 0) {
        return RESET_COLOR
      }

      if (columnMetric === 'none' || columnMetric === 'data_type') {
        return RESET_COLOR
      }

      const colMetricVal = column.metrics?.[columnMetric] ?? 0
      const colMetricVal2 =
        typeof colMetricVal !== 'string' ? colMetricVal : !isNaN(+colMetricVal) ? +colMetricVal : 0

      const normalizedColMVal = colMetricVal2 / columnMetricMaxValue

      return getMetricsColumnColor(normalizedColMVal)
    }

    const columnColorOnFocus = (column: Column): string => {
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

    // TODO: Move to `ColumnHighlights` ?
    const columnColor =
      highlightMode !== 'metrics'
        ? columnColorOnFocus
        : columnMetric.startsWith('count_') && countNormalize
        ? columnColorCountNormalizedMetrics
        : columnColorMetrics

    const cardHighlightedColor = style?.color ? style.color : GREY_ACCENT
    const titleHighlightColor =
      style && [ADDED_NODE_HIGHLIGHT_COLOR, DELETED_NODE_HIGHLIHT_COLOR].includes(style.color)
        ? style.color
        : RESET_COLOR

    const isHoverableColumn = !['none', 'diffing'].includes(highlightMode)

    return (
      <div onClick={() => onClick(id)} onDoubleClick={() => onDoubleClick(id)}>
        <ScrollCard
          title={<ScrollCardTitle color={titleHighlightColor}>{label}</ScrollCardTitle>}
          size="small"
          type="inner"
          extra={tableMetricValFormatted}
          highlightColor={cardHighlightedColor}
        >
          <List
            size="small"
            dataSource={_columns}
            renderItem={(column: Column) => {
              const columnExtra = formatColumnExtra(column, columnMetric, countNormalize)
              const tooltip = `${column.name}: ${columnExtra}`

              return (
                <List.Item>
                  <ItemContent title={tooltip}>
                    <ItemText
                      hoverable={isHoverableColumn}
                      color={columnColor(column)}
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
      </div>
    )
  }
)

const selectTableMetric = (state: GraphStore) => state.tableMetric
const selectColumnMetric = (state: GraphStore) => state.columnMetric
const selectHighlightMode = (state: GraphStore) => state.highlightMode
const selectTableId = (state: GraphStore) => state.highlightedColumns.selectedTableId
const selectColumnId = (state: GraphStore) => state.highlightedColumns.selectedColumnId
const selectRelColumnIds = (state: GraphStore) => state.highlightedColumns.relatedColumnsIds

const formatColumnExtra = (
  column: Column,
  columnMetric: ColumnMetric,
  countNormalize: boolean = false
): string => {
  if (column.metrics === undefined || columnMetric === 'none') {
    return ''
  }

  if (columnMetric === 'data_type' && column.metrics[columnMetric] !== undefined) {
    return formatColumnDataType(column.metrics['data_type']!)
  }

  if (columnMetric.startsWith('count_') && countNormalize) {
    const totalCount = column.metrics['count'] ?? 1
    const count = (column.metrics[columnMetric] as number) ?? 0
    const normalized = count / totalCount

    return formatPercentage(normalized)
  }

  return formatColumnMetric(column.metrics[columnMetric] as string | number)
}

const fmt = renderNumericValue(2, true)
const formatTableMetric = (val: number) => fmt(val)
const formatColumnMetric = (val: number | string) => (typeof val === 'number' ? fmt(val) : val)

const formatColumnDataType = (data_type: NodeColumnDataType) =>
  `${data_type.type}${data_type.nullable ? '?' : ''}`
