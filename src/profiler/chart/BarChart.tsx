import React from 'react'
import ReactEcharts from 'echarts-for-react'

import { BarChartProps } from '../model'

const BarChart = ({ series, xData, height, isLogScale, haveAxes }: BarChartProps): JSX.Element => {
  const type = isLogScale ? 'log' : 'value'

  return (
    <ReactEcharts
      opts={{ renderer: 'svg' }}
      style={{ width: '100%', height }}
      option={{
        animation: false,
        grid: {
          left: haveAxes ? 50 : 10,
          right: haveAxes ? 25 : 10,
          top: haveAxes ? 25 : 10,
          bottom: haveAxes ? 25 : 10,
          borderWidth: 0,
        },
        xAxis: {
          type: 'category',
          data: xData,
          axisTick: {
            show: haveAxes,
          },
          axisLine: {
            show: haveAxes,
            onZero: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: { show: haveAxes },
        },
        yAxis: {
          type,
          axisTick: {
            show: haveAxes,
          },
          axisLine: {
            show: haveAxes,
            onZero: false,
          },
          axisLabel: { show: haveAxes },
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
