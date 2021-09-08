import React, { useCallback } from 'react'
import Table from 'antd/lib/table'
import Tooltip from 'antd/lib/tooltip'

import PushpinOutlined from '@ant-design/icons/lib/icons/PushpinOutlined'

import VirtualTable from './VirtualTable'
import { TableTitleWrapper, TableTitle, SampleTableWrapper, IconButton } from '../styles'
import { SampleTableProps } from '../model'
import { MIN_TABLE_CELL_HEIGHT, TABLE_HEIGHT } from '../constants'

const SampleTable = ({
  sampleData,
  sampleColumns,
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
  withoutPagination,
  pagination,
  heightenedCell,
  smallSize,
  showReferencedColumns,
  setShowReferencedColumns,
  tableProps,
}: SampleTableProps): JSX.Element => {
  const handleChangePagination = useCallback(
    (pagination, filters, sorter, extra) => {
      tableProps.onChange?.(pagination, filters, sorter, extra)

      if (pagination.pageSize !== pageSize) {
        setPageSize(pagination.pageSize)
        setCurrentPage(1)
      } else {
        setCurrentPage(pagination.current)
      }
    },
    [pageSize, setPageSize, setCurrentPage]
  )

  const _tableProps = {
    showSorterTooltip: false,
    ...tableProps,
    columns: sampleColumns as any,
    dataSource: sampleData,
    scroll: {
      x: true as true,
      y: sampleData.length > 10 ? TABLE_HEIGHT : sampleData.length * MIN_TABLE_CELL_HEIGHT,
    },
    onChange: handleChangePagination,
  }

  return (
    <SampleTableWrapper heightenedCell={heightenedCell} smallSize={smallSize}>
      <TableTitleWrapper>
        <TableTitle>Data Sample</TableTitle>
        <IconButton role="button" onClick={setShowReferencedColumns}>
          <Tooltip title="Show only referenced columns">
            <PushpinOutlined style={{ color: showReferencedColumns ? '#000' : '#d3d3d3' }} />
          </Tooltip>
        </IconButton>
      </TableTitleWrapper>
      {withoutPagination ? (
        <VirtualTable {..._tableProps} />
      ) : (
        <Table
          {..._tableProps}
          sticky
          pagination={{
            current: currentPage,
            pageSize,
            showSizeChanger: sampleData?.length > pageSize,
            ...(pagination ? pagination : {}),
          }}
        />
      )}
    </SampleTableWrapper>
  )
}

export default SampleTable
