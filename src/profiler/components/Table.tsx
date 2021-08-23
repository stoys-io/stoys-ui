import React from 'react'

import { transformSecondsToDate } from '../../pmfPlot/helpers'
import { renderNumericCell } from '../columns'
import { CELL_TABLE_HEADER_HEIGHT } from '../constants'
import { Maybe } from '../../model'
import { ChartTableProps, TableChartData } from '../model'
import { ChartTable, ColorBlock } from '../styles'

function renderValue(value: string | number, type: string): Maybe<number | string | JSX.Element> {
  if (type === 'timestamp' || type === 'date') {
    return transformSecondsToDate(value, type)
  }

  if (type === 'float' || type === 'long' || type === 'double') {
    return renderNumericCell(value)
  }

  return value
}

const Table = ({ data, height }: ChartTableProps): JSX.Element => {
  const type = data[0].type

  const dataSource: Array<TableChartData> = data
    .map(item => {
      const { name, color, items } = item

      return items?.length
        ? items.map(({ item, count }) => ({
            key: `${name}-${color}-${Math.random()}`,
            item,
            count,
            color,
          }))
        : undefined
    })
    .filter((item): item is Array<TableChartData> => !!item)
    .flat()

  const groupedDataByItem = dataSource.reduce(
    (acc: { [key: string]: Array<TableChartData> }, item: TableChartData) => {
      acc[item.item] = [...(acc[item.item] ? acc[item.item] : []), item]

      return acc
    },
    {}
  )

  const sortedData = Object.values(groupedDataByItem)

  function getCounts(item: TableChartData): number {
    return item.count
  }

  sortedData.sort((a: Array<TableChartData>, b: Array<TableChartData>) => {
    const aCounts = a.map(getCounts)
    const bCounts = b.map(getCounts)
    const aMax = Math.max.apply(null, aCounts)
    const bMax = Math.max.apply(null, bCounts)

    return bMax - aMax
  })

  const tableData: Array<TableChartData> = sortedData.flat().slice(0, 10)

  const columns = [
    {
      key: 'item',
      title: 'item',
      dataIndex: 'item',
      render: (value: number | string, row: any) => {
        return (
          <>
            <ColorBlock color={row.color} />
            {renderValue(value, type)}
          </>
        )
      },
      align: 'right' as 'right',
    },
    {
      key: 'count',
      title: 'count',
      dataIndex: 'count',
      align: 'right' as 'right',
      render: renderNumericCell,
    },
  ]

  return (
    <ChartTable
      dataSource={tableData}
      columns={columns}
      pagination={false}
      scroll={{ y: height - CELL_TABLE_HEADER_HEIGHT }}
      height={height}
    />
  )
}

export default Table
