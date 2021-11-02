import React from 'react'
import Tooltip from 'antd/lib/tooltip'

import { renderNumericValue } from '../helpers'
import Threshold from './Threshold'
import Trends from './Trends'
import { getColumnWidth } from '../quality/columns'
import { defaultSort, renderPercentColumnValue, getGroupTitle } from './helpers'
import { ChangePercentValue, ThresholdViolatedWrapper } from './styles'
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

function renderColumnsValues(value: {
  prev?: Maybe<number | string>
  cur: Maybe<number | string>
}): JSX.Element {
  return (
    <>
      <div>{renderNumericColumnValue(value.cur)}</div>
      {value.prev === undefined ? null : <div>{renderNumericColumnValue(value.prev)}</div>}
    </>
  )
}

const filterColumns =
  (disabledColumns?: Array<string>) =>
  (column: ChildrenColumnType): boolean => {
    const title = typeof column.title === 'string' ? column.title : column.titleString

    return !disabledColumns?.includes(title!)
  }

const renderNumericColumnValue = (value?: Maybe<number | string>): JSX.Element => (
  <>{value ? renderNumericValue(2, false, false)(value) : '—'}</>
)

export const getMetricsColumns = (
  metricsData: MetricsData | undefined,
  previousReleaseDataIsShown: boolean,
  saveMetricThreshold: SaveMetricThreshold | undefined,
  disabledColumns?: Array<string>
) => {
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
              className: 'aligned-right',
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
                className: 'aligned-right',
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
            childrenColumns = childrenColumns.filter(filterColumns(disabledColumns))
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
    columns = columns.filter(filterColumns(disabledColumns))
  }

  return columns
}

export const getMetricsColumnsFromRawData = (
  metricsData: RawMetricsData,
  disabledColumns?: Array<string>,
  config: {
    showAbsDiffColumn?: boolean
    showRelativeDiffColumn?: boolean
  } = {}
) => {
  const { showAbsDiffColumn, showRelativeDiffColumn } = config
  const keyColumns = metricsData?.current.key_columns?.map((column: string) => ({
    id: column,
    dataIndex: column,
    title: getGroupTitle(column),
    key: column,
    fixed: 'left' as 'left',
    sorter: defaultSort(column),
    width: getColumnWidth(column),
  }))

  const currentColumnNames = Object.keys(metricsData.current.data[0])

  return currentColumnNames?.reduce((columnsData: Array<ColumnType>, colName) => {
    const isKeyColumn =
      metricsData?.current.key_columns && !!metricsData?.current.key_columns.includes(colName)

    if (!isKeyColumn) {
      let childrenColumns: Array<ChildrenColumnType> = [
        {
          id: `${colName}`,
          key: `${colName}`,
          dataIndex: `${colName}`,
          title: 'Value',
          sorter: defaultSort(`${colName}`),
          render: renderColumnsValues,
          width: getColumnWidth('Current'),
          className: 'aligned-right',
        },
      ]

      if (metricsData.previous) {
        const absDiffColumn: Array<ChildrenColumnType> = showAbsDiffColumn
          ? [
              {
                id: `${colName}_change`,
                key: `${colName}_change`,
                dataIndex: `${colName}_change`,
                title: <Tooltip title="Current - Previous">Change</Tooltip>,
                titleString: 'Change',
                sorter: defaultSort(`${colName}_change`),
                render: renderNumericColumnValue,
                width: getColumnWidth('Change'),
                disabled: true,
              },
            ]
          : []
        const relativeDiffColumn: Array<ChildrenColumnType> = showRelativeDiffColumn
          ? [
              {
                id: `${colName}_change_percent`,
                key: `${colName}_change_percent`,
                dataIndex: `${colName}_change_percent`,
                title: <Tooltip title="(Current - Previous) * 100% /Previous">% Change</Tooltip>,
                titleString: '% Change',
                sorter: defaultSort(`${colName}_change_percent`),
                render: renderPercentColumnValue,
                width: getColumnWidth('% Change'),
                disabled: true,
              },
            ]
          : []

        childrenColumns = [...childrenColumns, ...absDiffColumn, ...relativeDiffColumn]
      }

      if (disabledColumns) {
        childrenColumns = childrenColumns.filter(filterColumns(disabledColumns))
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
