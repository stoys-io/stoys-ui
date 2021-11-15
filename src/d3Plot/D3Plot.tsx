import React from 'react'
import * as d3 from 'd3'

import useD3 from './useD3'
import { COLORS } from '../profiler/constants'

const MARGIN_LEFT = 25
const MARGIN_RIGHT = 25
const MARGIN_TOP = 25
const MARGIN_BOTTOM = 25

const D3Plot = ({ dataset, config }: any) => {
  const { height, color } = config

  const ref = useD3((svg: any) => {
    const { width } = svg.node().getBoundingClientRect()
    const flattedData = dataset.flat()

    const lowValues = d3.map(flattedData, (item: any) => item.low)
    const minValue = d3.min(lowValues)

    const highValues = d3.map(flattedData, (item: any) => item.high)
    const maxValue = d3.max(highValues)

    const barSimpleWidth = (width - MARGIN_LEFT - MARGIN_RIGHT) / (maxValue - minValue)

    const counts = d3.map(flattedData, (item: any) => item.count)
    const maxCount = d3.max(counts)
    const barSimpleHeight = (height - MARGIN_TOP - MARGIN_BOTTOM) / maxCount

    const xType = d3.scaleLinear
    const yType = d3.scaleLinear // TODO: add log scale here

    const xRange = [MARGIN_LEFT, width - MARGIN_RIGHT]
    const yRange = [height - MARGIN_BOTTOM, MARGIN_TOP]

    const xDomain = [minValue, maxValue]
    const yDomain = [0, maxCount]

    const xScale = xType(xDomain, xRange)
    const yScale = yType(yDomain, yRange)

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(width / 80)
      .tickSizeOuter(0)
    const yAxis = d3.axisLeft(yScale).ticks(height / 40)

    svg
      .append('g')
      .attr('transform', `translate(${MARGIN_LEFT},0)`)
      .call(yAxis)
      .call((g: any) => g.select('.domain').remove())
      .call((g: any) =>
        g
          .selectAll('.tick line')
          .clone()
          .attr('x2', width - MARGIN_LEFT - MARGIN_RIGHT)
          .attr('stroke-opacity', 0.1)
      )
      .call((g: any) =>
        g
          .append('text')
          .attr('x', -MARGIN_LEFT)
          .attr('y', 10)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
      )

    svg
      .append('g')
      .attr('transform', `translate(0,${height - MARGIN_BOTTOM})`)
      .call(xAxis)
      .call((g: any) =>
        g
          .append('text')
          .attr('x', width - MARGIN_RIGHT)
          .attr('y', 27)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'end')
      )

    dataset.map((data: any, index: number) => {
      const _color = color && color[index] ? color[index] : COLORS[index]

      svg
        .append('g')
        .attr('fill', _color)
        .attr('opacity', '0.75')
        .selectAll('rect')
        .data(data)
        .join('rect')
        .attr('width', (item: any) => {
          return (item.high - item.low) * barSimpleWidth
        })
        .attr('height', function (item: any) {
          return item.count * barSimpleHeight
        })
        .attr('x', function (item: any) {
          return xScale(item.low)
        })
        .attr('y', function (item: any) {
          return yScale(item.count)
        })
    })
  }, [])

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

export default D3Plot
