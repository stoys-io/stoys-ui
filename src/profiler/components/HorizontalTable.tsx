import React, { useCallback, useMemo } from 'react'
import Table from 'antd/lib/table'

import 'antd/lib/table/style/css'

import { TABLE_HEIGHT } from '../constants'
import { TableProps } from '../model'

const HorizontalTable = ({
  data,
  columns,
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
  withoutPagination,
}: TableProps) => {
  const handleChangePagination = useCallback(
    pagination => {
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

  return (
    <Table
      dataSource={data}
      columns={columns}
      expandable={{ expandIcon: () => null, expandedRowKeys: keys }}
      pagination={
        withoutPagination
          ? false
          : {
              current: currentPage,
              pageSize,
              showSizeChanger: true,
            }
      }
      scroll={{
        x: true,
        y: withoutPagination ? TABLE_HEIGHT : undefined,
      }}
      onChange={handleChangePagination}
    />
  )
}

export default HorizontalTable
