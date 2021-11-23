import React, { useState, useMemo } from 'react'
import { VariableSizeGrid as Grid } from 'react-window'
import ResizeObserver from 'rc-resize-observer'
import Table, { ColumnType, TableProps } from 'antd/lib/table'

import { MIN_TABLE_CELL_HEIGHT } from '../quality/constants'
import { ParentColumn } from '../aggSum/model'

function VirtualTable<T extends object>(
  props: TableProps<T> & {
    parentsColumns?: Array<ParentColumn>
    rowHeight?: number
    scroll: { y: number }
  }
): JSX.Element {
  const { columns, scroll, parentsColumns, rowHeight } = props
  const [tableWidth, setTableWidth] = useState(0)

  const columnCount = columns!.length
  const totalColumnWidth = useMemo(
    () => columns!.reduce((acc, column) => acc + Number(column.width), 0),
    [columns]
  )
  const mergedColumns: MergedColumns<T> = columns!.map(column => {
    if (column.width && totalColumnWidth > tableWidth) {
      return { ...column, width: Number(column.width) }
    }

    return {
      ...column,
      width: Math.floor(tableWidth / columnCount),
    }
  })

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
              row: renderTableHeaderRow(parentsColumns),
            },
            body: renderVirtualList<T>(mergedColumns, {
              scroll,
              tableWidth,
              rowHeight,
            }),
          } as any
        }
      />
    </ResizeObserver>
  )
}

const renderTableHeaderRow =
  (parentsColumns?: Array<ParentColumn>) => (props: { children: Array<JSX.Element> }) => {
    const twoRowsColumnsName: Array<string> | undefined = parentsColumns
      ?.filter((column: ParentColumn) => 'rowSpan' in column)
      .map(column => column.title)
    const _columns = props.children.filter(
      (col: JSX.Element) => !twoRowsColumnsName?.includes(col.props.column.titleString)
    )
    const _parentsColumns = parentsColumns?.map(column => {
      if ('rowSpan' in column) {
        const childColumn = props.children.find(
          (col: any) => col.props.column.titleString === column.title
        )

        return childColumn
          ? { ...childColumn, props: { ...childColumn.props, rowSpan: column.rowSpan } }
          : column
      }

      return column
    })

    return (
      <>
        {_parentsColumns ? (
          <tr>
            {_parentsColumns.map(col =>
              'title' in col ? (
                <th
                  key={col.title}
                  colSpan={col.colSpan}
                  rowSpan={col.rowSpan}
                  className="ant-table-cell"
                >
                  {col.title}
                </th>
              ) : (
                col
              )
            )}
          </tr>
        ) : null}
        <tr>{_columns.map((child: any) => child)}</tr>
      </>
    )
  }

const renderVirtualList =
  <T extends object>(
    mergedColumns: MergedColumns<T>,
    {
      tableWidth,
      rowHeight,
      scroll,
    }: { tableWidth: number; rowHeight?: number; scroll: { y: number } }
  ) =>
  (
    rawData: Array<T>,
    {
      scrollbarSize,
      onScroll,
    }: {
      scrollbarSize: number
      onScroll: (info: { currentTarget?: HTMLElement; scrollLeft?: number }) => void
    }
  ) => {
    const totalHeight = rawData?.length * (rowHeight ? rowHeight : MIN_TABLE_CELL_HEIGHT)

    const getRowHeight = (index: number): number => {
      if ('rowHeight' in rawData[index]) {
        return (rawData[index] as any).rowHeight
      }

      return rowHeight ? rowHeight : MIN_TABLE_CELL_HEIGHT
    }

    return (
      <Grid
        className="virtual-grid"
        columnCount={mergedColumns?.length}
        columnWidth={(index: number) => {
          const { width } = mergedColumns[index]
          const columnWidth =
            totalHeight > scroll.y && index === mergedColumns?.length - 1
              ? width - scrollbarSize - 1
              : width

          return columnWidth
        }}
        height={scroll.y}
        rowCount={rawData?.length}
        rowHeight={getRowHeight}
        width={tableWidth}
        onScroll={onScroll}
      >
        {renderCell(mergedColumns, rawData)}
      </Grid>
    )
  }

const renderCell =
  <T extends object>(mergedColumns: MergedColumns<T>, rawData: Array<T>) =>
  ({
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
    let _style = {
      ...style,
      width: column.width,
      left: left,
    }

    const renderedValue = render(value, rawData[rowIndex], rowIndex)
    if (renderedValue?.children) {
      if (renderedValue.props.rowSpan === 0 || renderedValue.props.colSpan === 0) {
        return null
      }

      if (renderedValue.props.colSpan) {
        _style = {
          ..._style,
          width: '100%',
        }
      }

      if (renderedValue.props.rowSpan) {
        _style = {
          ..._style,
          height: 50,
        }
      }
    }

    return (
      <div
        className={`virtual-table-cell ${
          columnIndex === mergedColumns?.length - 1 ? 'virtual-table-cell-last' : ''
        } ${column.className ? column.className : ''}`}
        style={_style}
      >
        {renderedValue?.children ? renderedValue.children : renderedValue}
      </div>
    )
  }

type MergedColumns<T> = Array<ColumnType<T> & { width: number }>

export default VirtualTable
