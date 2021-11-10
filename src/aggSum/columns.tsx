import React from 'react'
import Tooltip from 'antd/lib/tooltip'

import { renderNumericValue } from '../helpers'
import { getColumnWidth } from '../quality/columns'
import Threshold from './Threshold'
import Trends from './Trends'
import { defaultSort, renderPercentColumnValue, getGroupTitle } from './helpers'
import { ChangePercentValue, ThresholdViolatedWrapper } from './styles'
import {
  ColumnNode,
  ChildrenColumnType,
  AggSumData,
  RawAggSumData,
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

export const getAggSumColumns = (
  aggSumData: AggSumData | undefined,
  previousReleaseDataIsShown: boolean,
  saveMetricThreshold: SaveMetricThreshold | undefined,
  disabledColumns?: Array<string>
) => {
  if (!aggSumData?.columns) {
    return []
  }

  const keyColumns = aggSumData.columns.map((column: ColumnNode) => ({
    ...column,
    id: column.columnName,
    dataIndex: column.columnName,
    key: column.columnName,
    fixed: 'left' as 'left',
    sorter: defaultSort(column.columnName),
    width: getColumnWidth(column.title),
  }))

  const currentAggSumValue = aggSumData?.values[0].filter(
    col => !aggSumData?.columns?.find((column: ColumnNode) => column.columnName === col.columnName)
  )

  let columns: Array<ColumnType> = currentAggSumValue.reduce(
    (columnsData: Array<ColumnType>, cell) => {
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
            className: 'aligned-right',
          },
          {
            id: `${cell.columnName}_change_percent`,
            key: `${cell.columnName}_change_percent`,
            dataIndex: `${cell.columnName}_change_percent`,
            title: <Tooltip title="(Current - Previous) * 100% /Previous">% Change</Tooltip>,
            titleString: '% Change',
            className: 'aligned-right',
            sorter: defaultSort(`${cell.columnName}_change_percent`),
            render: (value, item) => {
              const threshold = item[`${cell.columnName}_threshold`]
              if (value && (threshold || threshold === 0) && Math.abs(value) > Number(threshold)) {
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
                keyColumns={aggSumData?.columns || []}
                aggSumDataItem={item}
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
    },
    keyColumns
  )

  if (disabledColumns) {
    columns = columns.filter(filterColumns(disabledColumns))
  }

  return columns
}

export const getAggSumColumnsFromRawData = (
  aggSumData: RawAggSumData,
  config: {
    disabledColumns?: Array<string>
    showAbsDiffColumn?: boolean
    showRelativeDiffColumn?: boolean
    maxColumnsNames: { [key: string]: string }
  }
) => {
  const { showAbsDiffColumn, showRelativeDiffColumn, maxColumnsNames, disabledColumns } = config
  const keyColumns = aggSumData?.current.key_columns?.map((column: string) => ({
    id: column,
    dataIndex: column,
    title: getGroupTitle(column),
    titleString: getGroupTitle(column),
    key: column,
    // fixed: 'left' as 'left', TODO: make fixed in virt grid
    sorter: defaultSort(column),
    render: (value: any) => <span>{value}</span>,
    width: getColumnWidth(
      maxColumnsNames?.[column]?.length < column.length ? column : maxColumnsNames[column]
    ),
  }))

  const currentColumnNames = Object.keys(aggSumData.current.data[0]).filter(
    colName => !aggSumData?.current.key_columns.includes(colName)
  )

  const columns = currentColumnNames?.reduce((columnsData: Array<ColumnType>, colName) => {
    let childrenColumns: Array<ChildrenColumnType> = [
      {
        id: `${colName}`,
        key: `${colName}`,
        dataIndex: `${colName}`,
        title: aggSumData.previous ? 'Value' : getGroupTitle(colName),
        sorter: defaultSort(`${colName}`),
        render: renderColumnsValues,
        className: 'aligned-right',
        width: getColumnWidth(
          maxColumnsNames?.[colName]?.length < colName.length ? colName : maxColumnsNames[colName]
        ),
      },
    ]

    if (aggSumData.previous) {
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
              disabled: true,
              className: 'aligned-right',
              width: getColumnWidth(
                maxColumnsNames?.[colName]?.length < colName.length
                  ? colName
                  : maxColumnsNames[colName]
              ),
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
              disabled: true,
              className: 'aligned-right',
              width: getColumnWidth(
                maxColumnsNames?.[colName]?.length < colName.length
                  ? colName
                  : maxColumnsNames[colName]
              ),
            },
          ]
        : []

      childrenColumns = [...childrenColumns, ...absDiffColumn, ...relativeDiffColumn]
    }

    return [
      ...columnsData,
      ...(aggSumData.previous
        ? [
            {
              id: colName,
              key: colName,
              dataIndex: colName,
              title: getGroupTitle(colName),
              children: childrenColumns,
            },
          ]
        : childrenColumns),
    ]
  }, keyColumns)

  if (disabledColumns) {
    return columns.filter(filterColumns(disabledColumns))
  }

  return columns
}
