import React, { useMemo } from 'react'
import ReactEcharts from 'echarts-for-react'

import { renderNumericValue } from '../helpers'
import { transformSecondsToDate, renderItem, removeZeroData } from './helpers'
import { COLORS } from '../profiler/constants'
import { PmfPlotProps } from './model'
import { ChartWrapper } from './styles'

function marker(color: string): string {
  return `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>`
}

const PmfPlot = ({
  data,
  dataType,
  height = '100%',
  width = '100%',
  showAxis,
  showLogScale,
  color,
  plotOptions = {},
}: PmfPlotProps): JSX.Element => {
  const isDataSet = Array.isArray(data[0])
  const axisType = showLogScale ? 'log' : 'value'
  const values = isDataSet ? data.flat() : data
  const lowValues = values.map((item: any) => item.low)
  const minValue = Math.min.apply(null, lowValues)
  const highValues = values.map((item: any) => item.high)
  const maxValue = Math.max.apply(null, highValues)

  const opts = useMemo(() => ({ renderer: 'svg' as 'svg' }), [])
  const style = useMemo(() => ({ width, height }), [height, width])

  const pmfPlotData = (isDataSet ? data : [data])
    .map((dataSet: any, index: number) =>
      dataSet.map((dataItem: any) => [
        dataItem.low,
        dataItem.high,
        dataItem.count,
        (Array.isArray(color) ? color[index] : color) || COLORS[index],
      ])
    )
    .filter(removeZeroData(showLogScale))

  const series = pmfPlotData.map((pmfPlotItem, index) => ({
    type: 'custom',
    renderItem: renderItem(!!showLogScale),
    data: pmfPlotItem,
    dataType,
    dimensions: ['low', 'high', 'count'],
    encode: {
      x: ['low', 'high'],
      y: 'count',
      tooltip: ['low', 'high', 'count'],
    },
    itemStyle: {
      color: (Array.isArray(color) ? color[index] : color) || COLORS[index],
    },
    emphasis: {
      focus: 'none',
    },
  }))

  if (!isFinite(minValue) && !isFinite(maxValue)) {
    return <></>
  }

  function getTooltipValue(value: string): string {
    const item =
      value && (dataType === 'timestamp' || dataType === 'date')
        ? transformSecondsToDate(value, dataType)
        : isNaN(+value)
        ? value
        : renderNumericValue(2, true)(value)

    return `${item}`
  }

  function renderTooltip(param: any): string {
    const filteredValues = pmfPlotData.flat().filter(pmfPlotDataItem => {
      return param.axisValue >= pmfPlotDataItem[0] && param.axisValue < pmfPlotDataItem[1]
    })

    if (!filteredValues.length) {
      return ''
    }

    return `
      <div>
      ${filteredValues
        .map(
          values =>
            `${marker(values[3])} ${getTooltipValue(values[0])} - ${getTooltipValue(
              values[1]
            )} <b>${
              isNaN(+values[2]) ? values[2] : renderNumericValue(2, true)(values[2])
            }</b><br />`
        )
        .join('')}
      </div>
    `
  }

  function tooltipFormatter(params: any): string {
    return renderTooltip(params[0])
  }

  const option = useMemo(
    () => ({
      animation: false,
      confine: true,
      blendMode: 'multiply',
      grid: {
        left: showAxis ? 50 : 10,
        right: showAxis ? 25 : 10,
        top: showAxis ? 25 : 10,
        bottom: showAxis ? 25 : 10,
        borderWidth: 0,
      },
      xAxis: {
        min: minValue,
        max: maxValue,
        axisTick: {
          show: showAxis,
        },
        axisLine: {
          show: showAxis,
          onZero: false,
        },
        splitLine: {
          show: false,
        },
        splitNumber: 3,
        axisLabel: {
          show: showAxis,
          formatter: function (value: any) {
            if (dataType === 'timestamp' || dataType === 'date') {
              return transformSecondsToDate(value, dataType)
            }

            return renderNumericValue(2, true)(value)
          },
        },
        axisPointer: {
          snap: false,
        },
      },
      yAxis: {
        min: +!!showLogScale,
        type: axisType,
        axisTick: {
          show: showAxis,
        },
        axisLine: {
          show: showAxis,
        },
        splitNumber: 3,
        axisLabel: {
          show: showAxis,
          formatter: function (value: any) {
            return renderNumericValue(2, true)(value)
          },
        },
      },
      dataZoom: [
        {
          type: 'inside',
          orient: 'horizontal',
          filterMode: 'weakFilter',
        },
      ],
      tooltip: {
        confine: true,
        trigger: 'axis',
        axisPointer: {
          type: 'line',
        },
        formatter: tooltipFormatter,
      },
      ...plotOptions,
      series,
    }),
    [series, plotOptions]
  )

  return (
    <ChartWrapper data-testid="pmf-plot">
      <ReactEcharts opts={opts} style={style} option={option} />
    </ChartWrapper>
  )
}

export default PmfPlot
