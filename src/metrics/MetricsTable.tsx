import React, { useCallback, useMemo } from 'react'

import 'antd/lib/table/style/css'

import usePagination from '../hooks/usePagination'
import { getMetricsColumns, getMetricsColumnsFromRawData } from './columns'
import { getMetricsDataFromRawData, getMetricsTableData } from './helpers'
import { MetricsTableProps } from './model'
import { StyledMetricTable } from './styles'

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
    } = {},
    onChange,
  } = props
  const { current, setCurrentPage, pageSize, setPageSize } = usePagination(pagination)
  const _columns = useMemo(() => {
    if (columns) {
      return columns
    }

    if ('current' in data) {
      return getMetricsColumnsFromRawData(data)
    }

    return getMetricsColumns(
      data,
      !!previousReleaseDataIsShown,
      saveMetricThreshold,
      disabledColumns
    )
  }, [data, columns, previousReleaseDataIsShown, saveMetricThreshold])

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

  return (
    <StyledMetricTable
      loading={isLoading}
      scroll={{ x: true, y: pagination || !height ? undefined : height }}
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
