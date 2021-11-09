import React, { useState, useMemo } from 'react'
import { VariableSizeGrid as Grid } from 'react-window'
import ResizeObserver from 'rc-resize-observer'
import Table, { ColumnType, TableProps } from 'antd/lib/table'

import { MIN_TABLE_CELL_HEIGHT } from '../quality/constants'
import { AggSumTableData, ParentColumn } from '../aggSum/model'

function VirtualTable(
  props: TableProps<AggSumTableData> & {
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
  const mergedColumns = columns!.map(column => {
    if (column.width && totalColumnWidth > tableWidth) {
      return column
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
            body: renderVirtualList(mergedColumns, {
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
  (
    mergedColumns: Array<ColumnType<AggSumTableData>>,
    {
      tableWidth,
      rowHeight,
      scroll,
    }: { tableWidth: number; rowHeight?: number; scroll: { y: number } }
  ) =>
  (rawData: Array<object>, { scrollbarSize, onScroll }: any) => {
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
        width: column.width,
        left: left,
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
            totalHeight > scroll.y && index === mergedColumns?.length - 1
              ? (width as number) - scrollbarSize - 1
              : (width as number)

          return columnWidth
        }}
        height={scroll.y}
        rowCount={rawData?.length}
        rowHeight={() => (rowHeight ? rowHeight : MIN_TABLE_CELL_HEIGHT)}
        width={tableWidth}
        onScroll={onScroll}
      >
        {renderCell}
      </Grid>
    )
  }

export default VirtualTable
