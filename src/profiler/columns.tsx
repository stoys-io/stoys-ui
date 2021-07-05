import React from 'react'
import Tooltip from 'antd/lib/tooltip'
import { ColumnsType } from 'antd/lib/table'

import ChartCellTitle from './components/ChartCellTitle'
import TableSubheaderRow from './components/TableSubheaderRow'
import { ChartWithTooltip, hygratePmfPlotData } from './chart'
import { renderNumericValue } from '../helpers'
import {
  AxisOptions,
  DataItem,
  HydratedDataItem,
  LogarithmicScale,
  Render,
  RenderedCellConfig,
  TableOptions,
} from './model'

import { CellWrapper, ColorBlock } from './styles'
import { transformSecondsToDate } from '../pmfPlot/helpers'
import { COLUMN_CHART_WIDTH } from './constants'

const renderChartCell =
  (data: Array<DataItem>, smallSize: boolean) =>
  (value: string, row: DataItem | HydratedDataItem, index: number) => {
    const parent = data.find(dataItem => {
      if ('parent' in row) {
        return row.parent === dataItem.columnName
      }

      return false
    })
    const pmfPlotData = hygratePmfPlotData(parent?.children)
    const renderedCellConfig: RenderedCellConfig = {
      children: <ChartWithTooltip data={pmfPlotData} smallSize={smallSize} />,
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

export const renderNumericCell = (value: number | string) => {
  return (
    <Tooltip title={value} placement="topLeft">
      <CellWrapper>{renderNumericValue(2, true)(value)}</CellWrapper>
    </Tooltip>
  )
}

const renderRow: Render = (logarithmicScale, axisOptions, tableOptions) => (value, row) => {
  const renderedCellConfig: RenderedCellConfig = {
    children: null,
    props: {},
  }

  if ('color' in row) {
    renderedCellConfig.children = (
      <>
        <ColorBlock color={row.color} />
        {renderNumericCell(value)}
      </>
    )
  }

  if ('columnName' in row) {
    renderedCellConfig.children = (
      <TableSubheaderRow
        row={row}
        rowOptions={{
          isLogCheckboxShown: logarithmicScale.isCheckboxShown,
          isAxisCheckboxShown: axisOptions.isCheckboxShown,
        }}
        tableOptions={tableOptions}
      />
    )
    renderedCellConfig.props.colSpan = 8
  }

  return renderedCellConfig
}

const renderValue = (
  value: string | number | null,
  row: any
): number | string | JSX.Element | null => {
  const { type } = row

  if (value === null) {
    return null
  }

  if (type === 'timestamp' || type === 'date') {
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

  if (!isNaN(+value) && value !== '') {
    return renderNumericCell(value)
  }

  return (
    <Tooltip title={value} placement="topLeft">
      {value}
    </Tooltip>
  )
}

const renderChartCellTitle = (
  logarithmicScale: LogarithmicScale,
  axisOptions: AxisOptions,
  tableOptions: TableOptions
) => (
  <ChartCellTitle
    logarithmicScale={logarithmicScale}
    axisOptions={axisOptions}
    tableOptions={tableOptions}
  />
)

export const getColumns = (
  data: Array<DataItem>,
  logarithmicScale: LogarithmicScale,
  axisOptions: AxisOptions,
  tableOptions: TableOptions,
  smallSize: boolean = false
): ColumnsType<DataItem | HydratedDataItem> => {
  return [
    {
      title: 'nulls',
      dataIndex: 'nulls',
      key: 'nulls',
      align: 'right' as 'right',
      render: renderRow(logarithmicScale, axisOptions, tableOptions),
    },
    {
      title: 'unique',
      dataIndex: 'unique',
      key: 'unique',
      align: 'right' as 'right',
      render: (value: string | number | undefined) =>
        value || value === 0 ? renderNumericCell(value) : null,
    },
    {
      title: 'mean',
      dataIndex: 'mean',
      key: 'mean',
      align: 'left' as 'left',
      render: renderValue,
    },
    {
      title: 'min',
      dataIndex: 'min',
      key: 'min',
      align: 'left' as 'left',
      render: renderValue,
    },
    {
      title: 'max',
      dataIndex: 'max',
      key: 'max',
      align: 'left' as 'left',
      render: renderValue,
    },
    {
      title: renderChartCellTitle(logarithmicScale, axisOptions, tableOptions),
      key: 'chart',
      className: 'chart-cell',
      width: COLUMN_CHART_WIDTH,
      render: renderChartCell(data, smallSize),
      align: 'left' as 'left',
    },
  ]
}
