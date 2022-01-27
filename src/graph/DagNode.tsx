// TODO: Remove type guards. Metric types should be well defined

import React, { useCallback } from 'react'
import List from 'antd/lib/list'

import pick from 'lodash.pick'

import {
  ADDED_NODE_HIGHLIGHT_COLOR,
  RESET_COLOR,
  DELETED_NODE_HIGHLIHT_COLOR,
  NODE_TEXT_COLOR,
  TRANSPARENT_NODE_TEXT_COLOR,
  GREY_ACCENT,
} from '../graph-common/constants'

import { formatPercentage, renderNumericValue } from '../helpers'
import {
  Node,
  NodeDataPayload,
  Column,
  ColumnMetric,
  NodeColumnDataType,
  ColumnNameIndex,
} from '../graph-common/model'
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
import TableMetricIndicator from './TableMetricIndicator'
import MetricColorIndicator from './MetricColorIndicator'
import { PmfPlotItem } from '../profiler/model'

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

  const tableMetric = useGraphStore(selectTableMetric)
  const columnMetric = useGraphStore(selectColumnMetric)

  const currentReleaseNodeNameIndex = useGraphStore(
    state => state.currentReleaseNodeNameIndex,
    (oldIndex, newIndex) => oldIndex.release === newIndex.release
  )
  const baseRelease = useGraphStore(state => state.baseRelease)
  const currentReleaseNode =
    baseRelease === ''
      ? undefined
      : currentReleaseNodeNameIndex.index[label]
      ? currentReleaseNodeNameIndex.index[label]
      : dummyNode

  const currentReleaseTableMetricData =
    currentReleaseNode === undefined
      ? undefined
      : pick(currentReleaseNode.data, ['violations', 'partitions'])

  let currentReleaseColumnMetricIndex: ColumnNameIndex | undefined = undefined
  if (currentReleaseNode !== undefined) {
    const cols = currentReleaseNode.data.columns
    currentReleaseColumnMetricIndex = cols.reduce(
      (acc: ColumnNameIndex, col): ColumnNameIndex => ({ ...acc, [col.name]: col }),
      {}
    )
  }

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
        extra={
          <TableMetricIndicator
            tableMetric={tableMetric}
            baseMetricData={{ partitions, violations }}
            currentMetricData={currentReleaseTableMetricData}
          />
        }
        highlightColor={cardHighlightedColor}
      >
        <List
          size="small"
          dataSource={_columns}
          renderItem={(column: Column) => {
            let tooltip = ''
            let columnExtra = null

            const curReleaseColumn = currentReleaseColumnMetricIndex?.[column.name]
            if (columnMetric !== 'pmf') {
              const columnExtraNoAverage = formatColumnExtra(
                column,
                columnMetric,
                countNormalize,
                false
              )
              const curColumnExtraNoAverage = curReleaseColumn
                ? ` (${formatColumnExtra(curReleaseColumn, columnMetric, countNormalize, false)})`
                : ''
              tooltip = `${column.name}: ${columnExtraNoAverage}${curColumnExtraNoAverage}`

              const columnExtraFmt = formatColumnExtra(column, columnMetric, countNormalize)
              const curColumnExtraFmt = curReleaseColumn
                ? formatColumnExtra(curReleaseColumn, columnMetric, countNormalize)
                : ''
              const showOtherMetric =
                curColumnExtraFmt && columnMetric !== 'data_type' && columnMetric !== 'none'

              columnExtra = (
                <ItemExtra>
                  {columnExtraFmt}
                  {showOtherMetric && (
                    <MetricColorIndicator
                      value={curReleaseColumn?.metrics?.[columnMetric]}
                      prevValue={column?.metrics?.[columnMetric]}
                      valueFormatted={curColumnExtraFmt}
                    />
                  )}
                </ItemExtra>
              )
            } else {
              tooltip = ''
              const pmfData = column.metrics?.['pmf'] ?? []
              const pmfDataCurrentRelease = curReleaseColumn?.metrics?.['pmf']
                ? curReleaseColumn.metrics['pmf']
                : undefined

              const dataset = pmfDataCurrentRelease
                ? normalizeDataset([pmfDataCurrentRelease, pmfData])
                : [pmfData]

              columnExtra = <TinyPmf dataset={dataset} />
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

export interface Props {
  id: string
  onClick: (id: string) => void
  onDoubleClick: (id: string) => void
  data?: NodeDataPayload
}

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

const formatColumnDataType = (data_type: NodeColumnDataType) =>
  `${data_type.type}${data_type.nullable ? '?' : ''}`

const fmtHelper = renderNumericValue(2, true)
const fmtHelperNoAverage = renderNumericValue(0, false)

const selectTableMetric = (state: GraphStore) => state.tableMetric
const selectColumnMetric = (state: GraphStore) => state.columnMetric
const selectHighlightMode = (state: GraphStore) => state.highlightMode
const selectTableId = (state: GraphStore) => state.highlightedColumns.selectedTableId
const selectColumnId = (state: GraphStore) => state.highlightedColumns.selectedColumnId
const selectRelColumnIds = (state: GraphStore) => state.highlightedColumns.relatedColumnsIds

const defaultData: NodeDataPayload = {
  label: 'no data',
  columns: [],
  violations: 0,
  partitions: 0,
}

const dummyNode: Node = {
  id: '',
  position: { x: 0, y: 0 },
  data: defaultData,
  type: 'dagNode',
}

const normalizeDataset = (dataset: PmfPlotItem[][]): PmfPlotItem[][] =>
  dataset.map(dataItem => {
    const totalCount = dataItem.reduce((sum, item) => sum + item.count, 0)
    const normalizedDataItem = dataItem.map(dataBin => ({
      ...dataBin,
      count: dataBin.count / totalCount,
    }))
    return normalizedDataItem
  })
