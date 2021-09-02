import React, { useContext } from 'react'
import Empty from 'antd/lib/empty'

import PmfPlot from '../../pmfPlot'
import { CheckedRowsContext, SizeContext } from '../context'
import Table from '../components/Table'
import BarChart from './BarChart'
import { ChartAndTableProps, HygratePmfPlotDataItem, RenderChartAndTableProps } from '../model'
import { Maybe } from '../../model'
import {
  MIN_CHART_CELL_HEIGHT,
  MIN_SMALL_CHART_CELL_HEIGHT,
  MIN_TABLE_ROW_HEIGHT,
  TABLE_ROW_HEIGHT,
} from '../constants'
import { StyledEmpty } from '../styles'
import { ChartWrapper } from '../../pmfPlot/styles'

function renderChartAndTable(
  data: Maybe<Array<HygratePmfPlotDataItem>>,
  {
    checkedLogRows,
    checkedAxesRows,
    checkedTableRows,
    isHorizontal,
    smallSize,
  }: RenderChartAndTableProps
) {
  if (!data) {
    return null
  }

  const parentName = data[0].parent
  const enabledLogScale = checkedLogRows.includes(parentName)
  const enabledAxes = checkedAxesRows.includes(parentName)
  const enableTableView = checkedTableRows.includes(parentName)
  const tableRowHeight = smallSize ? MIN_TABLE_ROW_HEIGHT : TABLE_ROW_HEIGHT
  const minChartHeight = smallSize ? MIN_SMALL_CHART_CELL_HEIGHT : MIN_CHART_CELL_HEIGHT
  const cellHeight: number = data.length * tableRowHeight
  const height: number = cellHeight < minChartHeight || isHorizontal ? minChartHeight : cellHeight

  if (enableTableView) {
    return <Table data={data} height={height} />
  }

  if (data[0].type === 'string') {
    const barsData = data.map(item => item?.items)
    const items = barsData?.map(bars => bars?.map(item => item.item))
    const flattenItems = items.reduce((accumulator: Array<string>, value) => {
      if (!value) {
        return accumulator
      }

      return accumulator.concat(value)
    }, [])
    const uniqueItems = [...new Set(flattenItems)]

    if (!uniqueItems.length) {
      return <StyledEmpty image={Empty.PRESENTED_IMAGE_SIMPLE} data-testid="bars-empty" />
    }

    const series = barsData.map((bars, index) => ({
      data: uniqueItems.map(item => {
        return bars?.find(bar => bar.item === item)?.count
      }),
      type: 'bar',
      name: data[index].name,
      barGap: '-100%',
      barMinWidth: 10,
      itemStyle: {
        color: data[index].color,
      },
    }))

    return (
      <ChartWrapper data-testid="bar-chart">
        <BarChart
          series={series}
          height={height}
          xData={uniqueItems}
          isLogScale={enabledLogScale}
          haveAxes={enabledAxes}
        />
      </ChartWrapper>
    )
  }

  const flattenPmfPlotData = data
    .map(dataItem => dataItem.pmf)
    .filter(dataItem => dataItem)
    .flat()

  if (!flattenPmfPlotData.length) {
    return <StyledEmpty image={Empty.PRESENTED_IMAGE_SIMPLE} data-testid="pmf-empty" />
  }

  const color = data.map(dataItem => dataItem.color)
  const pmfPlotDataData = data.map(dataItem => dataItem?.pmf || [])

  return (
    <PmfPlot
      data={pmfPlotDataData}
      height={height}
      dataType={data[0].type}
      showAxes={enabledAxes}
      showLogScale={enabledLogScale}
      color={color}
    />
  )
}

const ChartAndTable = ({ data, isHorizontal }: ChartAndTableProps): Maybe<JSX.Element> => {
  const smallSize = useContext(SizeContext)

  return (
    <CheckedRowsContext.Consumer>
      {({ checkedLogRows, checkedAxesRows, checkedTableRows }) =>
        renderChartAndTable(data, {
          checkedLogRows,
          checkedAxesRows,
          checkedTableRows,
          isHorizontal: !!isHorizontal,
          smallSize: smallSize,
        })
      }
    </CheckedRowsContext.Consumer>
  )
}

export default ChartAndTable
