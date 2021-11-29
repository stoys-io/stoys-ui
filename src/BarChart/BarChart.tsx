import React, { useMemo } from 'react'
import * as d3 from 'd3'

import { useD3 } from '../hooks'
import { DiscreteItem } from '../profiler/model'
import { COLORS } from '../profiler/constants'

const BarChart = ({ dataset, config }: BarChartProps): JSX.Element => {
  const { height, color, showAxes, showLogScale } = config

  const margin = useMemo(
    () => ({
      left: showAxes ? 25 : 2,
      right: showAxes ? 25 : 2,
      top: showAxes ? 25 : 2,
      bottom: showAxes ? 25 : 2,
    }),
    [showAxes]
  )

  const chartData: Array<ChartDataItem> = dataset
    .map((data: any, index: number) => {
      return data.map((dataItem: DiscreteItem) => ({
        ...dataItem,
        color: (Array.isArray(color) ? color[index] : color) || COLORS[index],
      }))
    })
    .flat()

  const ref = useD3(
    (svg: any) => {
      const { width } = svg.node().getBoundingClientRect()

      const yType = d3.scaleLinear

      const xRange = [margin.left, width - margin.right]
      const yRange = [height - margin.bottom, margin.top]

      const X = d3.map(chartData, d => d.item)
      const Y = d3.map(chartData, d => d.count)

      const xDomain = new d3.InternSet(X)
      const yDomain = [0, d3.max(Y) as number]

      const I = d3.range(X.length).filter(i => xDomain.has(X[i]))

      const xScale = d3.scaleBand(xDomain, xRange).padding(0.025)
      const yScale = yType(yDomain, yRange)

      if (showAxes) {
        const xAxis = d3
          .axisBottom(xScale)
          .ticks(width / 100)
          .tickSizeOuter(0)
        const yAxis = d3.axisLeft(yScale).ticks(height / 100)

        svg
          .append('g')
          .attr('transform', `translate(${margin.left},0)`)
          .attr('class', 'y-axis')
          .call(yAxis)
          .call((g: any) => g.select('.domain').remove())
          .call((g: any) =>
            g
              .selectAll('.tick line')
              .clone()
              .attr('x2', width - margin.left - margin.right)
              .attr('stroke-opacity', 0.1)
          )
          .call((g: any) =>
            g
              .append('text')
              .attr('x', -margin.left)
              .attr('y', 10)
              .attr('fill', 'currentColor')
              .attr('text-anchor', 'start')
          )

        svg
          .append('g')
          .attr('transform', `translate(0,${height - margin.bottom})`)
          .attr('class', 'x-axis')
          .call(xAxis)
          .call((g: any) =>
            g
              .append('text')
              .attr('x', width - margin.right)
              .attr('y', 27)
              .attr('fill', 'currentColor')
              .attr('text-anchor', 'end')
          )
      }

      const bar = svg
        .append('g')
        .selectAll('rect')
        .data(I)
        .join('rect')
        .attr('x', (i: any) => xScale(X[i]))
        .attr('y', (i: any) => yScale(Y[i]))
        .attr('height', (i: any) => yScale(0) - yScale(Y[i]))
        .attr('width', xScale.bandwidth())
        .attr('fill', (i: any) => chartData[i].color)
    },
    [config]
  )

  return (
    <svg
      ref={ref as any}
      style={{
        height,
        width: '100%',
      }}
    />
  )
}

interface BarChartProps {
  dataset: Array<Array<DiscreteItem>>
  config: {
    height: number
    color: Array<string>
    showAxes: boolean
    showLogScale: boolean
  }
}

interface ChartDataItem extends DiscreteItem {
  color: string
}

export default BarChart
