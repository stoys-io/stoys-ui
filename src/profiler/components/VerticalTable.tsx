import React, { useCallback } from 'react'
import Table from 'antd/lib/table'

import ChartTitle from './ChartTitle'
import { ChartWithTooltip, hygratePmfPlotData } from '../chart'
import { transformSecondsToDate } from '../../pmfPlot/helpers'
import { renderNumericCell } from '../columns'
import { VerticalColumn, VerticalTableProps } from '../model'
import { TABLE_HEIGHT } from '../constants'
import { ColorBlock } from '../styles'

const VerticalTable = ({
  data,
  columns,
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
  withoutPagination,
  rowOptions,
  tableOptions,
}: VerticalTableProps) => {
  const flattenData = data.map(item => item.children).flat()
  const verticalColumns: Array<VerticalColumn> = flattenData.map((item, index) => {
    const parent = data.find(dataItem => dataItem.columnName === item.parent)
    const childrenLength = Number(parent?.children.length)
    const colSpan = index % childrenLength ? 0 : childrenLength
    const chartData = hygratePmfPlotData(parent?.children)

    return {
      title: item.parent,
      dataIndex: item.key,
      key: item.key,
      colSpan,
      render: (record: any, row: any) => {
        if (row.key === 'chart') {
          return {
            props: { colSpan },
            children: (
              <>
                {parent ? (
                  <ChartTitle row={parent} rowOptions={rowOptions} tableOptions={tableOptions} />
                ) : null}
                <ChartWithTooltip data={chartData} isHorizontal />
              </>
            ),
          }
        }

        if (row.key === 'nulls' && childrenLength > 1) {
          return (
            <>
              <ColorBlock color={item.color} className="color-block" />
              {record.value}
            </>
          )
        }

        if (row.key === 'mean' || row.key === 'min' || row.key === 'max') {
          if (record.type === 'timestamp' || record.type === 'date') {
            return transformSecondsToDate(record.value, record.type)
          }

          if (record.type === 'float' || record.type === 'long' || record.type === 'double') {
            return record.value && renderNumericCell(record.value)
          }
        }

        return record.value
      },
    }
  })
  const dataSource = columns.map(column => {
    const result: { [key: string]: any } = { key: column.key, title: column.title }

    flattenData.forEach((item: any) => {
      if (column.key) {
        if (column.key === 'chart') {
          result[item.key] = {
            type: item.type,
            pmf: item.pmf,
            items: item.items,
          }
        } else {
          result[item.key] = { type: item.type, value: item[column.key] }
        }
      }
    })

    return result
  })

  verticalColumns.unshift({ title: '', dataIndex: 'title', key: 'title', fixed: 'left' })

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

  return (
    <Table
      bordered
      columns={verticalColumns}
      dataSource={dataSource}
      scroll={{ x: true, y: withoutPagination ? TABLE_HEIGHT : undefined }}
      rowClassName="horizontal-row"
      pagination={
        withoutPagination
          ? false
          : {
              current: currentPage,
              pageSize,
              showSizeChanger: true,
            }
      }
      onChange={handleChangePagination}
    />
  )
}

export default VerticalTable
