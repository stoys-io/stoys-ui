// TODO: Remove type guards. Metric types should be well defined

import React, { useCallback } from 'react'
import List from 'antd/lib/list'

import {
  ADDED_NODE_HIGHLIGHT_COLOR,
  RESET_COLOR,
  DELETED_NODE_HIGHLIHT_COLOR,
  NODE_TEXT_COLOR,
  TRANSPARENT_NODE_TEXT_COLOR,
  GREY_ACCENT,
} from '../graph-common/constants'

import { formatPercentage, renderNumericValue } from '../helpers'
import { Column, NodeDataPayload, ColumnMetric, NodeColumnDataType } from '../graph-common/model'
import {
  ItemContent,
  ItemText,
  ItemExtra,
  ScrollCard,
  ScrollCardTitle,
} from '../graph-common/styles'
import {
  useGraphStore,
  GraphStore,
  setHighlightedColumns,
  useGraphDispatch,
} from '../graph-common/store'
import { getMetricsColumnColor } from '../graph-common/ops'
import TinyPmf from './TinyPmf'

interface Props {
  id: string
  onClick: (id: string) => void
  onDoubleClick: (id: string) => void
  data?: NodeDataPayload
}

export const DagNode = ({ id, data: d, onClick, onDoubleClick }: Props): JSX.Element => {
  const data = d ? d : defaultData
  const { label, columns, violations, partitions } = data
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
    if (
      !metric.startsWith('count_') ||
      metric === 'none' ||
      metric === 'data_type' ||
      metric === 'pmf'
    ) {
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

    if (columnMetric === 'none' || columnMetric === 'data_type' || columnMetric === 'pmf') {
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

    if (columnMetric === 'none' || columnMetric === 'data_type' || columnMetric === 'pmf') {
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
    <div
      onClick={(evt: React.MouseEvent<HTMLElement>) => {
        evt.stopPropagation()
        onClick(id)
      }}
      onDoubleClick={(evt: React.MouseEvent<HTMLElement>) => {
        evt.stopPropagation()
        onDoubleClick(id)
      }}
    >
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
            let tooltip = ''
            let columnExtra = null

            if (columnMetric !== 'pmf') {
              const columnExtraNoAverage = formatColumnExtra(
                column,
                columnMetric,
                countNormalize,
                false
              )
              tooltip = `${column.name}: ${columnExtraNoAverage}`

              columnExtra = (
                <ItemExtra>{formatColumnExtra(column, columnMetric, countNormalize)}</ItemExtra>
              )
            } else {
              tooltip = ''
              const pmfData = column.metrics?.['pmf'] ?? []
              columnExtra = <TinyPmf dataset={[pmfData]} />
            }

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
                  {columnExtra}
                </ItemContent>
              </List.Item>
            )
          }}
        />
      </ScrollCard>
    </div>
  )
}

const selectTableMetric = (state: GraphStore) => state.tableMetric
const selectColumnMetric = (state: GraphStore) => state.columnMetric
const selectHighlightMode = (state: GraphStore) => state.highlightMode
const selectTableId = (state: GraphStore) => state.highlightedColumns.selectedTableId
const selectColumnId = (state: GraphStore) => state.highlightedColumns.selectedColumnId
const selectRelColumnIds = (state: GraphStore) => state.highlightedColumns.relatedColumnsIds

const fmtHelper = renderNumericValue(2, true)
const fmtHelperNoAverage = renderNumericValue(0, false)

const formatColumnExtra = (
  column: Column,
  columnMetric: ColumnMetric,
  countNormalize: boolean = false,
  average: boolean = true
): string => {
  if (column.metrics === undefined || columnMetric === 'none') {
    return ''
  }

  if (columnMetric === 'data_type' && column.metrics[columnMetric] !== undefined) {
    return formatColumnDataType(column.metrics['data_type']!)
  }

  if (columnMetric.startsWith('count_') && countNormalize) {
    const totalCount = column.metrics['count'] ?? 1
    const count = column.metrics[columnMetric] as number | undefined
    if (count === undefined) {
      return ''
    }

    const normalized = count / totalCount

    return formatPercentage(normalized)
  }

  const val = column.metrics[columnMetric] as string | number
  const formatColumnMetric =
    typeof val !== 'number' ? val : !average ? fmtHelperNoAverage(val) : fmtHelper(val)

  return formatColumnMetric
}

const formatTableMetric = (val: number) => fmtHelper(val)

const formatColumnDataType = (data_type: NodeColumnDataType) =>
  `${data_type.type}${data_type.nullable ? '?' : ''}`

const defaultData = { label: 'no data', columns: [], violations: 0, partitions: 0 }
