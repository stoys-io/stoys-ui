import React, { useCallback, useMemo } from 'react'

import 'antd/lib/table/style/css'

import usePagination from '../hooks/usePagination'
import { getMetricsColumns, getMetricsColumnsFromRawData } from './columns'
import { getMetricsDataFromRawData, getMetricsTableData } from './helpers'
import { MetricsTableProps, MetricsData, RawMetricsData } from './model'
import { StyledMetricTable } from './styles'

const TABLE_HEIGHT = 600

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
      height = TABLE_HEIGHT,
      smallSize = true,
    } = {},
    onChange,
  } = props
  const { current, setCurrentPage, pageSize, setPageSize } = usePagination(pagination)
  const _columns = useMemo(() => {
    if (columns) {
      return columns
    }
    // @ts-ignore
    if (data.current) {
      return getMetricsColumnsFromRawData(data as RawMetricsData)
    }
    return getMetricsColumns(
      data as MetricsData,
      !!previousReleaseDataIsShown,
      saveMetricThreshold,
      disabledColumns
    )
  }, [data, columns, previousReleaseDataIsShown, saveMetricThreshold])

  const _data = useMemo(() => {
    // @ts-ignore
    if (data.current) {
      return getMetricsDataFromRawData(data as RawMetricsData)
    }
    return getMetricsTableData(data as MetricsData)
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

  return (
    <StyledMetricTable
      loading={isLoading}
      scroll={{ x: true, y: pagination && pagination.disabled ? height : undefined }}
      smallSize={smallSize}
      bordered
      sticky
      {...props}
      columns={_columns}
      dataSource={_data}
      pagination={
        typeof pagination === 'object'
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
  )
}
