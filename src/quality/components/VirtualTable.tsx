import React, { useState, useEffect, useRef, useMemo } from 'react'
import { VariableSizeGrid as Grid } from 'react-window'
import ResizeObserver from 'rc-resize-observer'
import classNames from 'classnames'
import Table from 'antd/lib/table'

import { MIN_TABLE_CELL_HEIGHT } from '../constants'

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

  const gridRef = useRef<any>()
  const [connectObject] = useState<any>(() => {
    const obj = {}
    Object.defineProperty(obj, 'scrollLeft', {
      get: () => null,
      set: (scrollLeft: number) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({ scrollLeft })
        }
      },
    })

    return obj
  })

  const resetVirtualGrid = () => {
    gridRef.current.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: true,
    })
  }

  useEffect(() => resetVirtualGrid, [tableWidth, totalColumnWidth])

  const renderVirtualList = (rawData: Array<object>, { scrollbarSize, ref, onScroll }: any) => {
    ref.current = connectObject
    const totalHeight = rawData?.length * MIN_TABLE_CELL_HEIGHT

    const renderCell = (columnIndex: number, rowIndex: number): string | JSX.Element => {
      const value = (rawData[rowIndex] as any)[(mergedColumns as any)[columnIndex].dataIndex]
      const { metaData } = rawData[rowIndex] as any
      const render = (mergedColumns as any)[columnIndex].render

      return render(value, { metaData })
    }

    return (
      <Grid
        ref={gridRef}
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
            className={classNames('virtual-table-cell', {
              'virtual-table-cell-last': columnIndex === mergedColumns?.length - 1,
            })}
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
