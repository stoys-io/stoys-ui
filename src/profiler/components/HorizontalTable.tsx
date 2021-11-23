import React, { useCallback, useMemo } from 'react'
import Table from 'antd/lib/table'

import 'antd/lib/table/style/css'

import { TableProps } from '../model'
import VirtualTable from '../../common/VirtualTable'
import { TABLE_HEIGHT } from '../../quality/constants'
import { MIN_SMALL_CHART_CELL_HEIGHT } from '../constants'

const HorizontalTable = (props: TableProps) => {
  const {
    data,
    columns,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    withoutPagination,
    pagination,
    onChange,
    height,
    ...otherProps
  } = props
  const handleChangePagination = useCallback(
    (pagination, filters, sorter, extra) => {
      onChange?.(pagination, filters, sorter, extra)

      if (pagination.pageSize !== pageSize) {
        setPageSize(pagination.pageSize)
        setCurrentPage(1)
      } else {
        setCurrentPage(pagination.current)
      }
    },
    [pageSize, setPageSize, setCurrentPage]
  )

  const tableProps = {
    ...otherProps,
    dataSource: data,
    columns: columns as any,
  }

  return withoutPagination ? (
    <VirtualTable
      scroll={
        {
          y: typeof height === 'number' ? height : TABLE_HEIGHT,
        } as any
      }
      rowHeight={MIN_SMALL_CHART_CELL_HEIGHT}
      {...tableProps}
    />
  ) : (
    <Table
      sticky
      scroll={{
        x: true as true,
        y: withoutPagination && height ? height : '100%',
      }}
      {...tableProps}
      pagination={{ current: currentPage, pageSize, showSizeChanger: true, ...pagination }}
      onChange={handleChangePagination}
    />
  )
}

export default HorizontalTable
