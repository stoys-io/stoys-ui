import React, { useCallback } from 'react'
import Table from 'antd/lib/table'

import VirtualTable from './VirtualTable'
import { TableTitleWrapper, TableTitle, SampleTableWrapper } from '../styles'
import { SampleTableProps } from '../model'
import { TABLE_HEIGHT } from '../constants'

const SampleTable = ({
  sampleData,
  sampleColumns,
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
  withoutPagination,
  heightenedCell,
  smallSize,
}: SampleTableProps): JSX.Element => {
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

  const tableProps = {
    columns: sampleColumns as any,
    dataSource: sampleData,
    scroll: {
      x: true as true,
      y: withoutPagination ? TABLE_HEIGHT : undefined,
    },
    onChange: handleChangePagination,
    showSorterTooltip: false,
  }

  return (
    <SampleTableWrapper heightenedCell={heightenedCell} smallSize={smallSize}>
      <TableTitleWrapper>
        <TableTitle>Data Sample</TableTitle>
      </TableTitleWrapper>
      {withoutPagination ? (
        <VirtualTable {...tableProps} />
      ) : (
        <Table
          {...tableProps}
          pagination={{
            current: currentPage,
            pageSize,
            showSizeChanger: sampleData?.length > pageSize,
          }}
        />
      )}
    </SampleTableWrapper>
  )
}

export default SampleTable
