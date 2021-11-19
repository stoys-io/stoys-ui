import React, { useMemo } from 'react'
import * as d3 from 'd3'

import useD3 from './useD3'
import { COLORS } from '../profiler/constants'

const PmfPlot = ({ dataset, config }: any) => {
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

  const plotData: Array<any> = dataset
    .map((data: any, index: number) => {
      return data.map((dataItem: any) => ({
        ...dataItem,
        color: (Array.isArray(color) ? color[index] : color) || COLORS[index],
      }))
    })
    .flat()

  const ref = useD3(
    (svg: any) => {
      const { width } = svg.node().getBoundingClientRect()

      const lowValues = d3.map(plotData, (item: any) => item.low)
      const minValue = d3.min(lowValues)

      const highValues = d3.map(plotData, (item: any) => item.high)
      const maxValue = d3.max(highValues)

      const barSimpleWidth = (width - margin.left - margin.right) / (maxValue - minValue)

      const counts = d3.map(plotData, (item: any) => item.count)
      const maxCount = d3.max(counts)

      const xType = d3.scaleLinear
      const yType = showLogScale ? d3.scaleLog : d3.scaleLinear

      const xRange = [margin.left, width - margin.right] // [left, right]
      const yRange = [height - margin.bottom, margin.top] // [bottom, top]

      const xDomain = [minValue, maxValue]
      const yDomain = [showLogScale ? 1 : 0, maxCount]

      const xScale = xType(xDomain, xRange)
      const yScale = yType(yDomain, yRange)

      const _height = showLogScale ? yScale(1) : yScale(0)

      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      svg
        .call(zoom)
        .on('pointerenter pointermove', pointermoved)
        .on('pointerleave', () => tooltip.style('display', 'none').selectChildren().remove())

      let xAxis: any

      if (showAxes) {
        xAxis = d3
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

      svg
        .append('g')
        .selectAll('rect')
        .data(plotData)
        .join('rect')
        .attr('width', (item: any) => (item.high - item.low) * barSimpleWidth)
        .attr('height', (item: any) => _height - yScale(item.count))
        .attr('x', (item: any) => xScale(item.low))
        .attr('y', (item: any) => yScale(item.count))
        .attr('fill', (d: any) => d.color)
        .style('mix-blend-mode', 'multiply')

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

          if (xAxis) {
            _svg.selectAll('.x-axis').call(xAxis)
          }
        }
      }

      const body = d3.select('body')
      const tooltip = body.append('div').style('pointer-events', 'none')

      function pointermoved(event: any) {
        const [xCoordinate, yCoordinate] = d3.pointer(event) // [x, y]
        const xValue = xScale.invert(xCoordinate)

        const tooltipValues = plotData.filter(
          (item: any) => item.low < xValue && xValue <= item.high
        )

        const colorBadge = (color: string) => `
          <span style="
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 100%;
            margin-right: 5px;
            margin-left: 5px;
            background-color: ${color};
          "></span>
        `

        if (tooltipValues.length) {
          tooltip
            .style('display', 'block')
            .attr('class', 'plot-tooltip')
            .style('padding', '2px')
            .style('position', 'fixed')
            .style('background-color', '#fff')
            .style('border', '1px solid #000')
            .html(() => {
              return tooltipValues
                .map(
                  value =>
                    `<div>${colorBadge(value.color)} ${value.low} - ${value.high} <b>${
                      value.count
                    }</b></div>`
                )
                .join('')
            })

          const { width: tooltipWidth, height: tooltipHeight } = tooltip
            .node()!
            .getBoundingClientRect()

          let y = event.y + 15
          let x = event.x + 15

          if (x + tooltipWidth > windowWidth) {
            x = x - tooltipWidth - 15
          }

          if (y + tooltipHeight > windowHeight) {
            y = y - tooltipHeight - 15
          }

          tooltip.style('top', `${y}px`).style('left', `${x}px`)
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

export default PmfPlot
