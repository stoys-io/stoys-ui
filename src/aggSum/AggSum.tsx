import React, { useCallback, useMemo } from 'react'
import Table from 'antd/lib/table'

import 'antd/lib/table/style/css'

import VirtualTable from '../common/VirtualTable'
import usePagination from '../hooks/usePagination'
import { getAggSumColumns, getAggSumColumnsFromRawData } from './columns'
import {
  getAggSumDataFromRawData,
  getAggSumTableData,
  getColumnNameLength,
  getParentsColumns,
  transformColumnsForVirtualGrid,
} from './helpers'
import { AggSumTableData, AggSumTableProps } from './model'
import { StyledMetricTableWrapper } from './styles'
import { MIN_TABLE_CELL_HEIGHT, TABLE_HEIGHT } from '../quality/constants'

// Aggregate summary
const AggSum = (props: AggSumTableProps): JSX.Element => {
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
      return getAggSumDataFromRawData(data)
    }

    return getAggSumTableData(data)
  }, [data])

  const maxColumnsNames = useMemo(
    () =>
      _data.reduce((acc: { [key: string]: string }, row: AggSumTableData) => {
        Object.keys(row).forEach((columnName: string | number) => {
          if (!acc[columnName] || getColumnNameLength(row, columnName) > acc[columnName]?.length) {
            acc[columnName] = String(row[columnName]) || String(columnName)
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
      return getAggSumColumnsFromRawData(data, {
        disabledColumns,
        showAbsDiffColumn,
        showRelativeDiffColumn,
        maxColumnsNames,
      })
    }

    return getAggSumColumns(
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
    showSorterTooltip: false,
    ...props,
    dataSource: _data,
  }

  return (
    <StyledMetricTableWrapper smallSize={smallSize}>
      {pagination || !('current' in data) ? (
        <Table
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
          parentsColumns={getParentsColumns(_columns)}
          rowHeight={'previous' in data ? 2 * MIN_TABLE_CELL_HEIGHT : MIN_TABLE_CELL_HEIGHT}
          scroll={{
            x: true as true,
            y: height
              ? height
              : _data.length > 10
              ? TABLE_HEIGHT
              : _data.length * MIN_TABLE_CELL_HEIGHT,
          }}
        />
      )}
    </StyledMetricTableWrapper>
  )
}

export default AggSum
