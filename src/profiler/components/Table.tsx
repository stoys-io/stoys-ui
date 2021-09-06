import React from 'react'

import { transformSecondsToDate } from '../../pmfPlot/helpers'
import { renderNumericCell } from '../../common'
import { CELL_TABLE_HEADER_HEIGHT, COLORS } from '../constants'
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

const renderCount = (index: number) => (value: string | number, row: any) => {
  const color = `color${index}`

  return {
    props: { style: { backgroundColor: row[color] }, className: 'count-cell' },
    children: isNaN(+value) ? null : renderNumericCell(value),
  }
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

  let maxIndex = 0

  const tableData = Object.keys(groupedDataByItem).map(key => {
    if (maxIndex < groupedDataByItem[key].length) {
      maxIndex = groupedDataByItem[key].length
    }

    return groupedDataByItem[key].reduce((acc: any, item: any, index: number) => {
      return {
        ...acc,
        key: item.key,
        item: item.item,
        [`count${index}`]: item.count,
        [`color${index}`]: item.color,
      }
    }, {})
  })

  const countColumns = new Array(maxIndex + 1).fill(1).map((value, index) => {
    return {
      key: `count${index}`,
      title: 'count',
      dataIndex: `count${index}`,
      align: 'right' as 'right',
      render: renderCount(index),
    }
  })

  const columns = [
    {
      key: 'item',
      title: 'item',
      dataIndex: 'item',
      render: (value: number | string, row: TableChartData | {}) => {
        return (
          <>
            <ColorBlock color={'color' in row ? row.color : COLORS[1]} />
            {renderValue(value, type)}
          </>
        )
      },
      align: 'right' as 'right',
    },
    ...countColumns,
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
