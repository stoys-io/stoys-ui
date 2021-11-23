import React, { useCallback } from 'react'
import Table from 'antd/lib/table'

import ChartCellTitle from './ChartCellTitle'
import { ChartAndTable, hygratePmfPlotData } from '../chart'
import { transformSecondsToDate, formatPercentage } from '../../helpers'
import { renderNumericCell } from '../../common'
import {
  ChildDataItem,
  DataItem,
  DataItemModel,
  VerticalColumn,
  VerticalData,
  VerticalTableProps,
} from '../model'
import { NORMALIZABLE_COLUMN_PREFIX } from '../constants'
import { ColorBlock } from '../styles'

const VerticalTable = (props: VerticalTableProps) => {
  const {
    data,
    columns,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    withoutPagination,
    pagination,
    displayNormalized,
    onChange,
    height,
    ...otherProps
  } = props
  const flattenData: Array<ChildDataItem> = data.filter(
    (item): item is ChildDataItem => 'parent' in item
  )
  const verticalColumns: Array<VerticalColumn> = flattenData.map((item, index) => {
    const parent: DataItemModel | undefined = data.find(
      (dataItem): dataItem is DataItemModel =>
        'columnName' in dataItem && dataItem.columnName === item.parent
    )
    const children = flattenData.filter(dataItem => parent?.columnName === dataItem.parent)
    const childrenLength = Number(children.length)
    const colSpan = index % childrenLength ? 0 : childrenLength
    const chartData = hygratePmfPlotData(children)

    return {
      title: item.parent,
      dataIndex: item.key,
      key: item.key,
      colSpan,
      render: (record: any, row: VerticalData) => {
        if (row.key === 'chart') {
          return {
            props: { colSpan },
            children: (
              <>
                {parent ? <ChartCellTitle row={parent} /> : null}
                <ChartAndTable
                  data={chartData}
                  isHorizontal
                  displayNormalized={displayNormalized}
                />
              </>
            ),
          }
        }

        if (displayNormalized && (row.key as string).includes(NORMALIZABLE_COLUMN_PREFIX)) {
          return formatPercentage(record.value)
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
    const result: VerticalData = { key: column.key, title: column.title }

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

  return (
    <Table
      sticky
      bordered
      scroll={{ x: true, y: withoutPagination && height ? height : undefined }}
      {...otherProps}
      columns={verticalColumns}
      dataSource={dataSource}
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
      rowClassName="horizontal-row"
    />
  )
}

export default VerticalTable
