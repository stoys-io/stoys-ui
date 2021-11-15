import React, { useMemo } from 'react'
import * as d3 from 'd3'

import useD3 from './useD3'
import { COLORS } from '../profiler/constants'

const D3Plot = ({ dataset, config }: any) => {
  const { height, color, showAxes } = config

  const margin = useMemo(
    () => ({
      left: showAxes ? 25 : 2,
      right: showAxes ? 25 : 2,
      top: showAxes ? 25 : 2,
      bottom: showAxes ? 25 : 2,
    }),
    [showAxes]
  )

  const ref = useD3(
    (svg: any) => {
      const { width } = svg.node().getBoundingClientRect()
      const flattedData = dataset.flat()

      const lowValues = d3.map(flattedData, (item: any) => item.low)
      const minValue = d3.min(lowValues)

      const highValues = d3.map(flattedData, (item: any) => item.high)
      const maxValue = d3.max(highValues)

      const barSimpleWidth = (width - margin.left - margin.right) / (maxValue - minValue)

      const counts = d3.map(flattedData, (item: any) => item.count)
      const maxCount = d3.max(counts)
      const barSimpleHeight = (height - margin.top - margin.bottom) / maxCount

      const xType = d3.scaleLinear
      const yType = d3.scaleLinear // TODO: add log scale here

      const xRange = [margin.left, width - margin.right] // [left, right]
      const yRange = [height - margin.bottom, margin.top] // [bottom, top]

      const xDomain = [minValue, maxValue]
      const yDomain = [0, maxCount]

      const xScale = xType(xDomain, xRange)
      const yScale = yType(yDomain, yRange)

      svg.call(zoom)

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

      function zoom(_svg: any) {
        const extent: [[number, number], [number, number]] = [
          [margin.left, margin.top],
          [width - margin.right, height - margin.top],
        ]

        const zoomX = d3.zoom().scaleExtent([1, 8]).translateExtent(extent).extent(extent)

        _svg.call(zoomX.on('zoom', zoomed))

        function zoomed(event: any) {
          xScale.range(xRange.map(item => event.transform.applyX(item)))
          _svg
            .selectAll('rect')
            .attr('x', (item: any) => xScale(item.low))
            .attr(
              'width',
              (item: any) => (item.high - item.low) * barSimpleWidth * event.transform.k
            )
        }
      }
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

export default D3Plot
