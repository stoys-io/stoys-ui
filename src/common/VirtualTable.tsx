import React, { useState, useMemo } from 'react'
import { VariableSizeGrid as Grid } from 'react-window'
import ResizeObserver from 'rc-resize-observer'
import Table from 'antd/lib/table'

import { MIN_TABLE_CELL_HEIGHT } from '../quality/constants'

function VirtualTable(
  props: Parameters<typeof Table>[0] & { parentsColumns?: Array<any>; rowHeight?: number }
): JSX.Element {
  const { columns, scroll, parentsColumns, rowHeight } = props
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
    const totalHeight = rawData?.length * (rowHeight ? rowHeight : MIN_TABLE_CELL_HEIGHT)

    const renderCell = ({
      columnIndex,
      rowIndex,
      style,
    }: {
      columnIndex: number
      rowIndex: number
      style: React.CSSProperties
    }) => {
      const column = (mergedColumns as any)[columnIndex]
      const columnsBefore = (mergedColumns as any).slice(0, columnIndex)
      const left = columnsBefore.reduce((w: number, column: any) => column.width + w, 0)
      const value = (rawData[rowIndex] as any)[column.dataIndex]
      const render = column.render
      const _style = {
        ...style,
        width: style.width ? style.width : column.width,
        left: columnIndex ? left : style.left,
      }

      return (
        <div
          className={`virtual-table-cell ${
            columnIndex === mergedColumns?.length - 1 ? 'virtual-table-cell-last' : ''
          } ${column.className ? column.className : ''}`}
          style={_style}
        >
          {render(value, rawData[rowIndex])}
        </div>
      )
    }

    return (
      <Grid
        className="virtual-grid"
        columnCount={mergedColumns?.length}
        columnWidth={(index: number) => {
          const { width } = mergedColumns[index]
          const columnWidth =
            totalHeight > scroll!.y! && index === mergedColumns?.length - 1
              ? (width as number) - scrollbarSize - 1
              : (width as number)

          return columnWidth
        }}
        height={scroll!.y as number}
        rowCount={rawData?.length}
        rowHeight={() => (rowHeight ? rowHeight : MIN_TABLE_CELL_HEIGHT)}
        width={tableWidth}
        onScroll={({ scrollLeft }: { scrollLeft: number }) => {
          onScroll({ scrollLeft })
        }}
      >
        {renderCell}
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
            header: {
              row: (props: any) => {
                return (
                  <>
                    {parentsColumns ? (
                      <tr>
                        {parentsColumns.map(col => (
                          <th
                            key={col.title}
                            colSpan={col.colSpan}
                            rowSpan={col.rowSpan}
                            className="ant-table-cell"
                          >
                            {col.title}
                          </th>
                        ))}
                      </tr>
                    ) : null}
                    <tr>{props.children.map((child: any) => child)}</tr>
                  </>
                )
              },
            },
            body: renderVirtualList,
          } as any
        }
      />
    </ResizeObserver>
  )
}

export default VirtualTable
