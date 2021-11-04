import React, { useCallback, useMemo } from 'react'

import 'antd/lib/table/style/css'

import VirtualTable from '../common/VirtualTable'
import usePagination from '../hooks/usePagination'
import { getMetricsColumns, getMetricsColumnsFromRawData } from './columns'
import { getMetricsDataFromRawData, getMetricsTableData } from './helpers'
import { MetricsTableProps } from './model'
import { StyledMetricTable } from './styles'
import { MIN_TABLE_CELL_HEIGHT, TABLE_HEIGHT } from '../quality/constants'

export const MetricsTable = (props: MetricsTableProps): JSX.Element => {
  const {
    columns,
    data,
    config: {
      isLoading,
      previousReleaseDataIsShown,
      saveMetricThreshold,
      pagination,
      disabledColumns,
      height,
      smallSize = true,
      showAbsDiffColumn,
      showRelativeDiffColumn,
    } = {},
    onChange,
  } = props

  const { current, setCurrentPage, pageSize, setPageSize } = usePagination(pagination)

  const _data = useMemo(() => {
    if ('current' in data) {
      return getMetricsDataFromRawData(data)
    }

    return getMetricsTableData(data)
  }, [data])

  const maxColumnsNames = useMemo(
    () =>
      _data.reduce((acc: { [key: string]: string }, row: any) => {
        Object.keys(row).forEach((columnName: string | number) => {
          const getColumnNameLength = (): number => {
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

          if (!acc[columnName] || getColumnNameLength() > acc[columnName]?.length) {
            acc[columnName] = row[columnName] || ''
          }
        })

        return acc
      }, {}),
    [_data]
  )

  const _columns = useMemo(() => {
    if (columns) {
      return columns
    }

    if ('current' in data) {
      return getMetricsColumnsFromRawData(data, {
        disabledColumns,
        showAbsDiffColumn,
        showRelativeDiffColumn,
        maxColumnsNames,
      })
    }

    return getMetricsColumns(
      data,
      !!previousReleaseDataIsShown,
      saveMetricThreshold,
      disabledColumns
    )
  }, [
    data,
    columns,
    previousReleaseDataIsShown,
    saveMetricThreshold,
    disabledColumns,
    showAbsDiffColumn,
    showRelativeDiffColumn,
  ])

  const _onChange = useCallback(
    (p, filters, sorter, extra) => {
      onChange?.(p, filters, sorter, extra)

      if (p.pageSize !== pageSize) {
        setPageSize(p.pageSize)
        setCurrentPage(1)
      } else {
        setCurrentPage(p.current)
      }
    },
    [pageSize, setPageSize, setCurrentPage]
  )

  const _tableProps = {
    smallSize,
    showSorterTooltip: false,
    ...props,
    dataSource: _data,
  }

  return pagination || !('current' in data) ? (
    <StyledMetricTable
      loading={isLoading}
      sticky={true}
      scroll={{ x: true as true, y: pagination || !height ? undefined : height }}
      {..._tableProps}
      columns={_columns}
      pagination={
        pagination
          ? {
              current: current,
              pageSize: pageSize,
              showSizeChanger: true,
              ...pagination,
            }
          : pagination
      }
      onChange={_onChange}
    />
  ) : (
    <VirtualTable
      {..._tableProps}
      columns={transformColumnsForVirtualGrid(_columns)}
      scroll={{
        x: true as true,
        y: height
          ? height
          : _data.length > 10
          ? TABLE_HEIGHT
          : _data.length * MIN_TABLE_CELL_HEIGHT,
      }}
    />
  )
}

function transformColumnsForVirtualGrid(columns: any) {
  return columns.reduce((acc: any, column: any) => {
    if ('children' in column) {
      return [...acc, ...column.children]
    }

    return [...acc, column]
  }, [])
}
