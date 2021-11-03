import React, { useState, useMemo } from 'react'
import { VariableSizeGrid as Grid } from 'react-window'
import ResizeObserver from 'rc-resize-observer'
import Table from 'antd/lib/table'

import { MIN_TABLE_CELL_HEIGHT } from '../quality/constants'

function VirtualTable(props: Parameters<typeof Table>[0]): JSX.Element {
  const { columns, scroll } = props
  const [tableWidth, setTableWidth] = useState(0)

  const columnCount = columns!.length
  const totalColumnWidth = useMemo(
    () => columns!.reduce((acc, column) => acc + Number(column.width), 0),
    [columns]
  )
  const mergedColumns = columns!.map(column => {
    if (column.width && totalColumnWidth > tableWidth) {
      return column
    }

    return {
      ...column,
      width: Math.floor(tableWidth / columnCount),
    }
  })

  const renderVirtualList = (rawData: Array<object>, { scrollbarSize, onScroll }: any) => {
    const totalHeight = rawData?.length * MIN_TABLE_CELL_HEIGHT

    const renderCell = (columnIndex: number, rowIndex: number): string | JSX.Element => {
      const value = (rawData[rowIndex] as any)[(mergedColumns as any)[columnIndex].dataIndex]
      const render = (mergedColumns as any)[columnIndex].render

      return render(value, rawData[rowIndex])
    }

    return (
      <Grid
        className="virtual-grid"
        columnCount={mergedColumns?.length}
        columnWidth={(index: number) => {
          const { width } = mergedColumns[index]

          return totalHeight > scroll!.y! && index === mergedColumns?.length - 1
            ? (width as number) - scrollbarSize - 1
            : (width as number)
        }}
        height={scroll!.y as number}
        rowCount={rawData?.length}
        rowHeight={() => MIN_TABLE_CELL_HEIGHT}
        width={tableWidth}
        onScroll={({ scrollLeft }: { scrollLeft: number }) => {
          onScroll({ scrollLeft })
        }}
      >
        {({
          columnIndex,
          rowIndex,
          style,
        }: {
          columnIndex: number
          rowIndex: number
          style: React.CSSProperties
        }) => (
          <div
            className={`virtual-table-cell ${
              columnIndex === mergedColumns?.length - 1 ? 'virtual-table-cell-last' : ''
            }`}
            style={style}
          >
            {renderCell(columnIndex, rowIndex)}
          </div>
        )}
      </Grid>
    )
  }

  return (
    <ResizeObserver
      onResize={({ width }) => {
        setTableWidth(width)
      }}
    >
      <Table
        {...props}
        className="virtual-table"
        columns={mergedColumns}
        pagination={false}
        components={
          {
            body: renderVirtualList,
          } as any
        }
      />
    </ResizeObserver>
  )
}

export default VirtualTable
