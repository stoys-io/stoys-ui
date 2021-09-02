import React from 'react'
import Tooltip from 'antd/lib/tooltip'
import { ColumnsType } from 'antd/lib/table'

import {
  COLUMNS_TITLES,
  COLUMNS_WITH_DATES,
  COLUMN_CHART_WIDTH,
  LEFT_ALIGN_COLUMNS,
  VISISBLE_COLUMNS,
} from './constants'
import ChartHeaderCellTitle from './components/ChartHeaderCellTitle'
import TableSubheaderRow from './components/TableSubheaderRow'
import { ChartAndTable, hygratePmfPlotData } from './chart'
import { renderNumericCell } from '../common'
import { transformSecondsToDate } from '../pmfPlot/helpers'
import {
  AxesOptions,
  DataItem,
  ChildDataItem,
  LogarithmicScale,
  Render,
  RenderedCellConfig,
  TableOptions,
} from './model'
import { Maybe } from '../model'

import { ColorBlock } from './styles'

const renderChartCell =
  (data: Array<DataItem>, smallSize: boolean) =>
  (value: string, row: DataItem | ChildDataItem, index: number) => {
    const parent = data.find(dataItem => {
      if ('parent' in row) {
        return row.parent === dataItem.columnName
      }

      return false
    })
    const pmfPlotData = hygratePmfPlotData(parent?.children)
    const renderedCellConfig: RenderedCellConfig = {
      children: <ChartAndTable data={pmfPlotData} smallSize={smallSize} />,
      props: {},
    }
    const rowSpan = parent?.children.length || 1

    if ('column' in row) {
      renderedCellConfig.props.colSpan = 0
    } else {
      renderedCellConfig.props.rowSpan = index === 0 ? rowSpan : 0
    }

    return renderedCellConfig
  }

const renderRow: Render = (render, logarithmicScale, axesOptions, tableOptions) => (value, row) => {
  const renderedCellConfig: RenderedCellConfig = {
    children: null,
    props: {},
  }

  if ('color' in row) {
    renderedCellConfig.children = (
      <>
        <ColorBlock color={row.color} />
        {render(value)}
      </>
    )
  }

  if ('columnName' in row) {
    renderedCellConfig.children = (
      <TableSubheaderRow
        row={row}
        rowOptions={{
          isLogCheckboxShown: logarithmicScale.isCheckboxShown,
          isAxesCheckboxShown: axesOptions.isCheckboxShown,
        }}
        tableOptions={tableOptions}
      />
    )
    renderedCellConfig.props.colSpan = 8
  }

  return renderedCellConfig
}

const renderValue = (value?: Maybe<boolean | string | number>): Maybe<JSX.Element> => {
  if (value === null || value === undefined) {
    return null
  }

  if (!isNaN(+value) && value !== '' && typeof value !== 'boolean') {
    return renderNumericCell(value)
  }

  return (
    <Tooltip title={value.toString()} placement="topLeft">
      {value.toString()}
    </Tooltip>
  )
}

const renderMeanMinMaxValue = (
  value: Maybe<string | number>,
  row: any
): Maybe<number | string | JSX.Element> => {
  const { data_type } = row

  if (value === null) {
    return null
  }

  if (data_type === 'timestamp' || data_type === 'date') {
    const date = transformSecondsToDate(value, row.type)

    if (typeof date === 'string') {
      return (
        <Tooltip title={date} placement="topLeft">
          {date.split(',').map(dateItem => (
            <React.Fragment key={dateItem}>
              {dateItem}
              <br />
            </React.Fragment>
          ))}
        </Tooltip>
      )
    }

    return (
      <Tooltip title={date} placement="topLeft">
        {date}
      </Tooltip>
    )
  }

  return renderValue(value)
}

const renderChartCellTitle = (
  logarithmicScale: LogarithmicScale,
  axesOptions: AxesOptions,
  tableOptions: TableOptions
) => (
  <ChartHeaderCellTitle
    logarithmicScale={logarithmicScale}
    axesOptions={axesOptions}
    tableOptions={tableOptions}
  />
)

export const getColumns = (
  data: Array<DataItem>,
  logarithmicScale: LogarithmicScale,
  axesOptions: AxesOptions,
  tableOptions: TableOptions,
  smallSize: boolean = false,
  visibleColumns?: Array<string>
): ColumnsType<DataItem | ChildDataItem> => {
  const _visibleColumns = visibleColumns?.length ? visibleColumns : VISISBLE_COLUMNS

  const columns = _visibleColumns.map((column, index) => {
    const _column: any = {
      title: COLUMNS_TITLES[column] || column,
      dataIndex: column,
      key: column,
      align: LEFT_ALIGN_COLUMNS.includes(column) ? ('left' as 'left') : ('right' as 'right'),
      render: COLUMNS_WITH_DATES.includes(column) ? renderMeanMinMaxValue : renderValue,
    }

    if (index === 0) {
      _column.render = renderRow(_column.render, logarithmicScale, axesOptions, tableOptions)
    }

    return _column
  })

  return [
    ...columns,
    {
      title: renderChartCellTitle(logarithmicScale, axesOptions, tableOptions),
      key: 'chart',
      className: 'chart-cell',
      width: COLUMN_CHART_WIDTH,
      render: renderChartCell(data, smallSize),
      align: 'left' as 'left',
    },
  ]
}
