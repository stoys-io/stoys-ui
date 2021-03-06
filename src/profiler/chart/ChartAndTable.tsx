import React, { useContext } from 'react'
import Empty from 'antd/lib/empty'

import PmfPlot from '../../pmfPlot'
import { CheckedRowsContext, ConfigContext } from '../context'
import Table from '../components/Table'
import BarChart from '../../BarChart'
import { ChartAndTableProps, ColumnType, DiscreteItem, PmfPlotItem } from '../model'
import { Maybe } from '../../model'
import { MIN_TABLE_ROW_HEIGHT, TABLE_ROW_HEIGHT } from '../constants'
import { BarChartWrapper, StyledEmpty } from '../styles'
import { formatPercentage, renderNumericValue, transformSecondsToDate } from '../../helpers'

const renderShortNumber = renderNumericValue(2, true)

const ChartAndTable = ({
  data,
  displayNormalized = false,
}: ChartAndTableProps): Maybe<JSX.Element> => {
  const { smallSize } = useContext(ConfigContext)
  const { checkedLogRows, checkedAxesRows, checkedTableRows } = useContext(CheckedRowsContext)
  if (!data) {
    return null
  }

  const parentName = data[0].parent
  const enabledLogScale = checkedLogRows.includes(parentName)
  const enabledAxes = checkedAxesRows.includes(parentName)
  const enableTableView = checkedTableRows.includes(parentName)
  const tableRowHeight = smallSize ? MIN_TABLE_ROW_HEIGHT : TABLE_ROW_HEIGHT
  const height: number = data.length * tableRowHeight

  if (enableTableView) {
    return <Table data={data} height={height} displayNormalized={displayNormalized} />
  }

  const color = data.map(dataItem => dataItem.color)

  if (data[0].type === 'string') {
    const barsData: Array<Array<DiscreteItem>> = data
      .map(item => item.items || [])
      .filter(item => item.length)

    if (!barsData.length) {
      return <StyledEmpty image={Empty.PRESENTED_IMAGE_SIMPLE} data-testid="bars-empty" />
    }

    return (
      <BarChartWrapper data-testid="bar-chart">
        <BarChart
          dataset={barsData}
          config={{
            height: height,
            showLogScale: enabledLogScale,
            showAxes: enabledAxes,
            color,
          }}
        />
      </BarChartWrapper>
    )
  }

  const flattenPmfPlotData = data
    .map(dataItem => dataItem.pmf)
    .filter(dataItem => dataItem)
    .flat()

  if (!flattenPmfPlotData.length) {
    return <StyledEmpty image={Empty.PRESENTED_IMAGE_SIMPLE} data-testid="pmf-empty" />
  }
  const pmfPlotDataData = data.map(dataItem =>
    displayNormalized
      ? normalizeCount(dataItem?.pmf || [], dataItem.itemsTotalCount)
      : dataItem?.pmf || []
  )
  const dataType = data[0].type as ColumnType

  return (
    <PmfPlot
      dataset={pmfPlotDataData}
      config={{
        height,
        showAxes: enabledAxes,
        showLogScale: enabledLogScale,
        color,
        dataType,
        formatTooltipValues: data => ({
          high:
            dataType === 'timestamp'
              ? transformSecondsToDate(data.high, 'date')
              : renderShortNumber(data.high),
          low:
            dataType === 'timestamp'
              ? transformSecondsToDate(data.low, 'date')
              : renderShortNumber(data.low),
          count: displayNormalized ? formatPercentage(data.count) : data.count,
        }),
      }}
    />
  )
}

function normalizeCount(data: Array<PmfPlotItem>, totalCount: number): Array<PmfPlotItem> {
  if (!data.length) {
    return []
  }

  return data.map(item => ({ ...item, count: item.count / totalCount }))
}

export default ChartAndTable
