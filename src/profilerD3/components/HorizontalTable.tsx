import React, { useCallback, useMemo } from 'react'
import Table from 'antd/lib/table'

import 'antd/lib/table/style/css'

import { TableProps } from '../model'

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
  const keys = useMemo(() => data.map(item => item.key), [data])
  const tableProps = {
    sticky: true,
    expandable: { expandIcon: () => null, expandedRowKeys: keys },
    scroll: {
      x: true as true,
      y: withoutPagination && height ? height : '100%',
    },
    ...otherProps,
    dataSource: data,
    columns: columns as any,
  }

  return (
    <Table
      {...tableProps}
      pagination={
        withoutPagination
          ? false
          : {
              current: currentPage,
              pageSize,
              showSizeChanger: true,
              ...pagination,
            }
      }
      onChange={handleChangePagination}
    />
  )
}

export default HorizontalTable
