import get from 'lodash.get'
import { v4 as uuidv4 } from 'uuid'

import { renderNumericValue } from '../helpers'

import {
  ColumnNode,
  MetricsData,
  MetricsTableData,
  RawMetricsData,
  SorterValue,
  TableCellNode,
} from './model'
import { Maybe } from '../model'

export const defaultSort = (field: string) => (a: SorterValue, b: SorterValue) => {
  return get(a, field) > get(b, field) ? 1 : -1
}

export const renderPercentColumnValue = (value: number) =>
  value || value === 0 ? `${renderNumericValue(2)(value)}%` : '—'

export const getGroupTitle = (key: string) =>
  key
    .split('_')
    .map(t => t[0].toUpperCase() + t.slice(1))
    .join(' ')

function addUniqueKey(item: MetricsTableData) {
  return {
    ...item,
    key: uuidv4(),
  }
}

export const getMetricsTableData = (metricsData: MetricsData) => {
  if (!metricsData?.columns) {
    return []
  }
  const keyColumns = metricsData.columns

  const items = metricsData?.values?.map((row: Array<TableCellNode>) =>
    row.reduce((acc: MetricsTableData, cell) => {
      const columnKey = cell.columnName
      const isKeyColumn = !!keyColumns.find((column: ColumnNode) => column.columnName === columnKey)
      if (isKeyColumn) {
        acc[cell.columnName] = cell.currentValue
      }

      if (!isKeyColumn) {
        acc[`${cell.columnName}_current`] = cell.currentValue
        acc[`${cell.columnName}_previous`] = cell.previousValue
        const changeValue =
          cell.currentValue && cell.previousValue
            ? Number(cell.currentValue) - Number(cell.previousValue)
            : null
        const changePercent = changeValue ? (changeValue * 100) / Number(cell.previousValue) : null
        acc[`${cell.columnName}_change`] = changeValue
        acc[`${cell.columnName}_change_percent`] = changePercent
        acc[`${cell.columnName}_threshold`] = cell.threshold
        acc[`${cell.columnName}_trends`] = cell.trends
      }
      return acc
    }, {})
  )
  return items?.map(addUniqueKey)
}

export const getMetricsDataFromRawData = (metricsData: RawMetricsData) => {
  if (!metricsData?.key_columns) {
    return []
  }
  const keyColumns = metricsData.key_columns
  const items = metricsData.data?.map(rawDataItem => {
    return Object.keys(rawDataItem).reduce(
      (dataItem: { [key: string]: Maybe<string | number> }, columnName) => {
        const isKeyColumn = keyColumns.includes(columnName)
        if (isKeyColumn) {
          dataItem[columnName] = rawDataItem[columnName]
        } else {
          dataItem[`${columnName}_current`] = rawDataItem[columnName]
        }
        return dataItem
      },
      {}
    )
  })
  return items?.map(addUniqueKey)
}
