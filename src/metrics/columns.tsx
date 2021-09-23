import React from 'react'
import Tooltip from 'antd/lib/tooltip'

import { renderNumericValue } from '../helpers'
import Threshold from './Threshold'
import Trends from './Trends'
import { getColumnWidth } from '../quality/columns'
import { defaultSort, renderPercentColumnValue, getGroupTitle } from './helpers'
import { UppercaseValue, ChangePercentValue, ThresholdViolatedWrapper } from './styles'
import {
  ColumnNode,
  TableCellNode,
  ChildrenColumnType,
  MetricsData,
  RawMetricsData,
  SaveMetricThreshold,
  ColumnType,
} from './model'
import { Maybe } from '../model'

const renderNumericColumnValue = (value?: Maybe<number | string>): JSX.Element => (
  <UppercaseValue>{value ? renderNumericValue(2, true)(value) : '—'}</UppercaseValue>
)

export const getMetricsColumns = (
  metricsData: MetricsData | undefined,
  previousReleaseDataIsShown: boolean,
  saveMetricThreshold: SaveMetricThreshold | undefined,
  disabledColumns?: Array<string>
) => {
  function filterColumns(column: ChildrenColumnType): boolean {
    return typeof column.title === 'string' && !disabledColumns?.includes(column.title)
  }

  if (!metricsData?.columns) {
    return []
  }

  const keyColumns = metricsData.columns.map((column: ColumnNode) => ({
    ...column,
    id: column.columnName,
    dataIndex: column.columnName,
    key: column.columnName,
    fixed: 'left' as 'left',
    sorter: defaultSort(column.columnName),
    width: getColumnWidth(column.title),
  }))

  let columns: Array<ColumnType> = []

  metricsData?.values?.forEach((row: Array<TableCellNode>, rowIndex: number) => {
    if (rowIndex === 0) {
      columns = row.reduce((columnsData: Array<ColumnType>, cell) => {
        const columnKey = cell.columnName
        const isKeyColumn =
          metricsData?.columns &&
          !!metricsData?.columns.find((column: ColumnNode) => column.columnName === columnKey)

        if (!isKeyColumn) {
          let childrenColumns: Array<ChildrenColumnType> = [
            {
              id: `${cell.columnName}_current`,
              key: `${cell.columnName}_current`,
              dataIndex: `${cell.columnName}_current`,
              title: 'Current',
              sorter: defaultSort(`${cell.columnName}_current`),
              render: renderNumericColumnValue,
            },
          ]

          if (previousReleaseDataIsShown) {
            childrenColumns = [
              ...childrenColumns,
              {
                id: `${cell.columnName}_previous`,
                key: `${cell.columnName}_previous`,
                dataIndex: `${cell.columnName}_previous`,
                title: 'Previous',
                sorter: defaultSort(`${cell.columnName}_previous`),
                render: renderNumericColumnValue,
              },
              {
                id: `${cell.columnName}_change`,
                key: `${cell.columnName}_change`,
                dataIndex: `${cell.columnName}_change`,
                title: <Tooltip title="Current - Previous">Change</Tooltip>,
                titleString: 'Change',
                sorter: defaultSort(`${cell.columnName}_change`),
                render: renderNumericColumnValue,
                disabled: true,
              },
              {
                id: `${cell.columnName}_change_percent`,
                key: `${cell.columnName}_change_percent`,
                dataIndex: `${cell.columnName}_change_percent`,
                title: <Tooltip title="(Current - Previous) * 100% /Previous">% Change</Tooltip>,
                titleString: '% Change',
                sorter: defaultSort(`${cell.columnName}_change_percent`),
                render: (value, item) => {
                  const threshold = item[`${cell.columnName}_threshold`]
                  if (
                    value &&
                    (threshold || threshold === 0) &&
                    Math.abs(value) > Number(threshold)
                  ) {
                    return (
                      <>
                        <ChangePercentValue>{renderPercentColumnValue(value)}</ChangePercentValue>
                        <ThresholdViolatedWrapper />
                      </>
                    )
                  }
                  return renderPercentColumnValue(value)
                },
              },
              {
                id: `${cell.columnName}_threshold`,
                key: `${cell.columnName}_threshold`,
                dataIndex: `${cell.columnName}_threshold`,
                title: 'Threshold',
                sorter: defaultSort(`${cell.columnName}_threshold`),
                render: (value, item) => (
                  <Threshold
                    threshold={value}
                    keyColumns={metricsData?.columns || []}
                    metricsDataItem={item}
                    valueColumnName={cell.columnName}
                    saveMetricThreshold={saveMetricThreshold}
                  />
                ),
              },
            ]
          }

          childrenColumns = [
            ...childrenColumns,
            {
              id: `${cell.columnName}_trends`,
              key: `${cell.columnName}_trends`,
              dataIndex: `${cell.columnName}_trends`,
              title: 'Trends',
              render: value => (value ? <Trends trends={value} /> : null),
              disabled: true,
            },
          ]

          if (disabledColumns) {
            childrenColumns = childrenColumns.filter(filterColumns)
          }

          return [
            ...columnsData,
            {
              id: cell.columnName,
              key: cell.columnName,
              dataIndex: cell.columnName,
              title: getGroupTitle(cell.columnName),
              children: childrenColumns,
            },
          ]
        }

        return columnsData
      }, keyColumns)
    }
  })

  if (disabledColumns) {
    columns = columns.filter(filterColumns)
  }

  return columns
}

export const getMetricsColumnsFromRawData = (
  metricsData: RawMetricsData,
  disabledColumns?: Array<string>
) => {
  function filterColumns(column: ChildrenColumnType): boolean {
    return typeof column.title === 'string' && !disabledColumns?.includes(column.title)
  }
  const keyColumns = metricsData?.key_columns?.map((column: string) => ({
    id: column,
    dataIndex: column,
    title: getGroupTitle(column),
    key: column,
    fixed: 'left' as 'left',
    sorter: defaultSort(column),
    width: getColumnWidth(column),
  }))

  const columnNames = Object.keys(metricsData.data[0])
  return columnNames?.reduce((columnsData: Array<ColumnType>, colName) => {
    const isKeyColumn = metricsData?.key_columns && !!metricsData?.key_columns.includes(colName)
    if (!isKeyColumn) {
      let childrenColumns: Array<ChildrenColumnType> = [
        {
          id: `${colName}_current`,
          key: `${colName}_current`,
          dataIndex: `${colName}_current`,
          title: 'Current',
          sorter: defaultSort(`${colName}_current`),
          render: renderNumericColumnValue,
        },
      ]
      if (disabledColumns) {
        childrenColumns = childrenColumns.filter(filterColumns)
      }
      return [
        ...columnsData,
        {
          id: colName,
          key: colName,
          dataIndex: colName,
          title: getGroupTitle(colName),
          children: childrenColumns,
        },
      ]
    }
    return columnsData
  }, keyColumns)
}
