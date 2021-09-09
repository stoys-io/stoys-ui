import React from 'react'
import Tooltip from 'antd/lib/tooltip'
import { ColumnsType } from 'antd/lib/table'

import {
  COLUMNS_TITLES,
  COLUMN_CHART_WIDTH,
  ITEM_VALUE_COLUMN_NAMES,
  LEFT_ALIGN_COLUMNS,
  VISISBLE_COLUMNS,
  NORMALIZABLE_COLUMN_PREFIX,
} from './constants'
import ChartAndTableHeaderCellTitle from './components/ChartAndTableHeaderCellTitle'
import TableSubheaderRow from './components/TableSubheaderRow'
import { ChartAndTable, hygratePmfPlotData } from './chart'
import { formatPercentage } from '../helpers'
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

const renderChartAndTableCell =
  (data: Array<DataItem>, displayNormalized: boolean) =>
  (value: string, row: DataItem | ChildDataItem, index: number) => {
    const parent = data.find(dataItem => {
      if ('parent' in row) {
        return row.parent === dataItem.columnName
      }

      return false
    })

    const pmfPlotData = hygratePmfPlotData(parent?.children)
    const renderedCellConfig: RenderedCellConfig = {
      children: <ChartAndTable data={pmfPlotData} displayNormalized={displayNormalized} />,
      props: {},
    }
    const rowSpan = parent?.children.length || 1

    if ('column' in row) {
      renderedCellConfig.props.colSpan = 0
    } else {
      renderedCellConfig.props.rowSpan = index === 0 ? rowSpan : 0
    }

    /* console.log('render cell') */
    return renderedCellConfig
  }

const renderRow: Render = (render, logarithmicScale, axesOptions) => (value, row) => {
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

export const renderNormalized = (value: number) => {
  // TODO: Why the value can be undefined
  if (value === undefined) {
    return null
  }

  return (
    <Tooltip title={formatPercentage(value)} placement="topLeft">
      {formatPercentage(value)}
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

const renderChartAndTableCellTitle = (
  logarithmicScale: LogarithmicScale,
  axesOptions: AxesOptions
) => <ChartAndTableHeaderCellTitle logarithmicScale={logarithmicScale} axesOptions={axesOptions} />

export const getColumns = (
  data: Array<DataItem>,
  logarithmicScale: LogarithmicScale,
  axesOptions: AxesOptions,
  displayNormalized: boolean,
  visibleColumns?: Array<string>
): ColumnsType<DataItem | ChildDataItem> => {
  const _visibleColumns = visibleColumns?.length ? visibleColumns : VISISBLE_COLUMNS

  /* console.log('test') */
  const columns = _visibleColumns.map((columnName, index) => {
    const isNormalized = displayNormalized && columnName.startsWith(NORMALIZABLE_COLUMN_PREFIX)

    const _column: any = {
      title: COLUMNS_TITLES[columnName] || columnName,
      dataIndex: columnName,
      key: columnName,
      align: LEFT_ALIGN_COLUMNS.includes(columnName) ? ('left' as 'left') : ('right' as 'right'),
      render: ITEM_VALUE_COLUMN_NAMES.includes(columnName)
        ? renderMeanMinMaxValue
        : isNormalized
        ? renderNormalized
        : renderValue,
    }

    if (index === 0) {
      _column.render = renderRow(_column.render, logarithmicScale, axesOptions)
    }

    return _column
  })

  return [
    ...columns,
    {
      title: renderChartAndTableCellTitle(logarithmicScale, axesOptions),
      key: 'chart',
      className: 'chart-cell',
      width: COLUMN_CHART_WIDTH,
      render: renderChartAndTableCell(data, displayNormalized),
      align: 'left' as 'left',
    },
  ]
}
