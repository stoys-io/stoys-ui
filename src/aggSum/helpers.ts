import get from 'lodash.get'
import { v4 as uuidv4 } from 'uuid'

import { renderNumericValue } from '../helpers'

import {
  ColumnNode,
  DataItemNode,
  AggSumData,
  AggSumTableData,
  RawAggSumData,
  SorterValue,
  TableCellNode,
  ParentColumn,
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

function addUniqueKey(item: AggSumTableData) {
  return {
    ...item,
    key: uuidv4(),
  }
}

export const getAggSumTableData = (aggSumData: AggSumData): Array<AggSumTableData> => {
  if (!aggSumData?.columns) {
    return []
  }

  const keyColumns = aggSumData.columns

  const items = aggSumData?.values?.map((row: Array<TableCellNode>) =>
    row.reduce((acc: AggSumTableData, cell) => {
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

export const getAggSumDataFromRawData = (aggSumData: RawAggSumData): Array<AggSumTableData> => {
  if (!aggSumData?.current.key_columns) {
    return []
  }

  const keyColumns = aggSumData.current.key_columns

  const items = aggSumData.current.data?.map(currentDataItem => {
    return Object.keys(currentDataItem).reduce(
      (
        dataItem: {
          [key: string]: Maybe<string | number> | DataItemNode
        },
        columnName
      ) => {
        const isKeyColumn = keyColumns.includes(columnName)
        const currentValue = currentDataItem[columnName]
        if (isKeyColumn) {
          dataItem[columnName] = currentValue
        } else {
          dataItem[columnName] = { cur: currentValue }
          if (aggSumData.previous?.data) {
            const matchedPreviousDataItem = aggSumData.previous?.data.find(item => {
              return keyColumns.every(
                keyColName => item[keyColName] === currentDataItem[keyColName]
              )
            })
            const previousValue = matchedPreviousDataItem
              ? matchedPreviousDataItem[columnName]
              : null
            dataItem[columnName] = { cur: currentValue, prev: previousValue }
            const changeValue =
              currentValue && previousValue ? Number(currentValue) - Number(previousValue) : null
            const changePercent = changeValue ? (changeValue * 100) / Number(previousValue) : null
            dataItem[`${columnName}_change`] = changeValue
            dataItem[`${columnName}_change_percent`] = changePercent
          }
        }

        return dataItem
      },
      {}
    )
  })
  return items?.map(addUniqueKey)
}

export function transformColumnsForVirtualGrid(columns: any) {
  return columns.reduce((acc: any, column: any) => {
    if ('children' in column) {
      return [...acc, ...column.children]
    }

    return [...acc, column]
  }, [])
}

export function getParentsColumns(columns: any): Array<ParentColumn> {
  return columns.map((column: any) => {
    if ('children' in column) {
      return { title: column.title, colSpan: column.children.length }
    }

    return { title: column.title, rowSpan: 2 }
  })
}

export function getColumnNameLength(row: any, columnName: string | number): number {
  if (!row[columnName]) {
    return 0
  }

  if (typeof row[columnName] === 'object' && 'cur' in row[columnName]) {
    const curLength = String(row[columnName].cur).length
    const prevLength = String(row[columnName].prev).length

    return curLength > prevLength ? curLength : prevLength
  }

  return String(row[columnName]).length
}
