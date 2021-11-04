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
  const _columns = useMemo(() => {
    if (columns) {
      return columns
    }

    if ('current' in data) {
      return getMetricsColumnsFromRawData(data, disabledColumns, {
        showAbsDiffColumn,
        showRelativeDiffColumn,
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

  const _data = useMemo(() => {
    if ('current' in data) {
      return getMetricsDataFromRawData(data)
    }

    return getMetricsTableData(data)
  }, [data])

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
    columns: _columns,
    dataSource: _data,
  }

  return pagination || !('current' in data) ? (
    <StyledMetricTable
      loading={isLoading}
      sticky={true}
      scroll={{ x: true as true, y: pagination || !height ? undefined : height }}
      {..._tableProps}
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
