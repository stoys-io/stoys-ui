import React from 'react'
import ReactEcharts from 'echarts-for-react'

import { BarChartProps } from '../model'

const BarChart = ({ series, xData, height, isLogScale, haveAxis }: BarChartProps): JSX.Element => {
  const type = isLogScale ? 'log' : 'value'

  return (
    <ReactEcharts
      opts={{ renderer: 'svg' }}
      style={{ width: '100%', height }}
      option={{
        animation: false,
        grid: {
          left: haveAxis ? 50 : 10,
          right: haveAxis ? 25 : 10,
          top: haveAxis ? 25 : 10,
          bottom: haveAxis ? 25 : 10,
          borderWidth: 0,
        },
        xAxis: {
          type: 'category',
          data: xData,
          axisTick: {
            show: haveAxis,
          },
          axisLine: {
            show: haveAxis,
            onZero: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: { show: haveAxis },
        },
        yAxis: {
          type,
          axisTick: {
            show: haveAxis,
          },
          axisLine: {
            show: haveAxis,
            onZero: false,
          },
          axisLabel: { show: haveAxis },
        },
        dataZoom: [
          {
            type: 'inside',
            orient: 'horizontal',
            filterMode: 'weakFilter',
          },
        ],
        series,
        tooltip: {
          confine: true,
          trigger: 'axis',
          axisPointer: {
            type: 'line',
          },
          formatter: (params: any) => {
            return `
              <div>
                ${params
                  .map((param: any) => {
                    if (!param.data) {
                      return
                    }

                    return `
                      <div>
                        ${param.marker} ${param.name}: ${param.data} <br />
                      </div>
                    `
                  })
                  .filter((item: any) => item)
                  .join('<hr />')}
              </div>
            `
          },
        },
      }}
    />
  )
}

export default BarChart
