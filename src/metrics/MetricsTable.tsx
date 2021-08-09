import React, { useCallback, useMemo } from 'react'

import 'antd/lib/table/style/css'

import usePagination from '../hooks/usePagination'
import { getMetricsColumns } from './columns'
import { getMetricsTableData } from './helpers'
import { MetricsTableProps } from './model'
import { StyledMetricTable } from './styles'

const TABLE_HEIGHT = 600

export const MetricsTable = ({
  columns,
  data,
  isLoading,
  previousReleaseDataIsShown,
  saveMetricThreshold,
  pagination,
  disabledColumns,
  height = TABLE_HEIGHT,
  smallSize = true,
}: MetricsTableProps): JSX.Element => {
  const { currentPage, setCurrentPage, pageSize, setPageSize } = usePagination(pagination)
  const _columns = useMemo(
    () =>
      columns ||
      getMetricsColumns(data, !!previousReleaseDataIsShown, saveMetricThreshold, disabledColumns),
    [data, columns, previousReleaseDataIsShown, saveMetricThreshold]
  )
  const _data = useMemo(() => getMetricsTableData(data), [data])
  const _onChange = useCallback(
    p => {
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
      sticky
      columns={_columns}
      dataSource={_data}
      loading={isLoading}
      scroll={{ x: true, y: pagination && pagination.disabled ? height : undefined }}
      bordered
      pagination={
        pagination && pagination.disabled
          ? false
          : {
              current: currentPage,
              pageSize: pageSize,
              showSizeChanger: true,
            }
      }
      onChange={_onChange}
      smallSize={smallSize}
    />
  )
}
