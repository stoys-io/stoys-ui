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
  SaveMetricThreshold,
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

  const keyColumns = metricsData.columns.map((column: ColumnNode) => {
    return {
      ...column,
      id: column.columnName,
      dataIndex: column.columnName,
      fixed: 'left',
      sorter: defaultSort(column.columnName),
      width: getColumnWidth(column.title),
    }
  })

  let columns: Array<any> = []

  metricsData?.values?.forEach((row: Array<TableCellNode>, rowIndex: number) => {
    if (rowIndex === 0) {
      columns = row.reduce((columnsData: Array<any>, cell) => {
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
