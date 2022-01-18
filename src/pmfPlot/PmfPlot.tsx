import React from 'react'
import * as d3 from 'd3'

import { useD3 } from '../hooks'
import { COLORS } from '../profiler/constants'
import { getMargin } from '../common/chartHelpers'
import { ColumnType, PmfPlotItem } from '../profiler/model'
import { renderNumericValue, transformSecondsToDate } from '../helpers'

const PmfPlot = ({ dataset, config = {} }: PmfPlotProps) => {
  const { height, color, showAxes, showXAxis, showYAxis, showLogScale, dataType } = config

  const margin = getMargin(!!showAxes, !!showXAxis, !!showYAxis)

  const plotData: Array<PlotData> = dataset
    .map((data: Array<PmfPlotItem>, index: number) => {
      return data.map((dataItem: PmfPlotItem) => ({
        ...dataItem,
        color: (Array.isArray(color) ? color[index] : color) || COLORS[index],
      }))
    })
    .flat()

  const ref = useD3(
    (svg: any) => {
      const { width, height: _height } = svg.node().getBoundingClientRect()

      const lowValues = d3.map(plotData, (item: PlotData) => item.low)
      const minValue = d3.min(lowValues)

      const highValues = d3.map(plotData, (item: PlotData) => item.high)
      const maxValue = d3.max(highValues)

      const barSimpleWidth = (width - margin.left - margin.right) / (maxValue! - minValue!)

      const counts = d3.map(plotData, (item: any) => item.count)
      const maxCount = d3.max(counts)

      const xType = d3.scaleLinear
      const yType = showLogScale ? d3.scaleLog : d3.scaleLinear

      const xRange = [margin.left, width - margin.right] // [left, right]
      const yRange = [_height - margin.bottom, margin.top] // [bottom, top]

      const xDomain = [minValue!, maxValue!]
      const yDomain = [showLogScale ? 1 : 0, maxCount]

      const xScale = xType(xDomain, xRange)
      const yScale = yType(yDomain, yRange)

      const scaleHeight = showLogScale ? yScale(1) : yScale(0)

      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      svg
        .call(zoom)
        .on('pointerenter pointermove', pointermoved)
        .on('pointerleave', () => tooltip.style('display', 'none').selectChildren().remove())

      let xAxis: any

      if (showAxes || showXAxis) {
        xAxis = d3
          .axisBottom(xScale)
          .ticks(width / 100)
          .tickSizeOuter(0)
          .tickFormat(tick => {
            if (dataType === 'timestamp') {
              return `${transformSecondsToDate(tick as number, 'date')}`
            }

            return `${tick}`
          })

        svg
          .append('g')
          .attr('transform', `translate(0,${_height - margin.bottom})`)
          .attr('class', 'x-axis')
          .call(xAxis)
          .call((g: any) =>
            g
              .append('text')
              .attr('x', width - margin.right)
              .attr('y', 20)
              .attr('fill', 'currentColor')
              .attr('text-anchor', 'end')
          )
      }

      if (showAxes || showYAxis) {
        const yAxis = d3.axisLeft(yScale).ticks(_height / 100)

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
      }

      svg
        .append('g')
        .selectAll('rect')
        .data(plotData)
        .join('rect')
        .attr('width', (item: any) => (item.high - item.low) * barSimpleWidth)
        .attr('height', (item: any) => scaleHeight - yScale(item.count))
        .attr('x', (item: any) => xScale(item.low))
        .attr('y', (item: any) => yScale(item.count))
        .attr('fill', (d: any) => d.color)
        .style('mix-blend-mode', 'multiply')

      function zoom(_svg: any) {
        const extent: [[number, number], [number, number]] = [
          [margin.left, margin.top],
          [width - margin.right, _height - margin.top],
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
      // TODO: fix tooltip as any
      const tooltip: any = d3.select('.plot-tooltip').node()
        ? d3.select('.plot-tooltip')
        : body.append('div').style('pointer-events', 'none').attr('class', 'plot-tooltip')

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
            // .style('display', 'flex')
            // .style('flex-direction', 'row')
            // .style('justify-content', 'space-between')
            .style('padding', '2px')
            .style('position', 'absolute')
            .style('background-color', '#fff')
            .style('border', '1px solid #000')
            .html(() => {
              return tooltipValues
                .map(value => {
                  let low: string | number = value.low
                  let high: string | number = value.high

                  if (dataType === 'timestamp') {
                    low = transformSecondsToDate(low, 'date')
                    high = transformSecondsToDate(high, 'date')
                  }

                  return `<div style="display: flex; justify-content: space-between">
                    <span>${colorBadge(value.color)} ${low} - ${high}</span> 
                    <span style="padding-left: 2px"><b>${renderNumericValue(
                      2,
                      false
                    )(value.count)}</b></span>
                  </div>`
                })
                .join('')
            })

          const { width: tooltipWidth, height: tooltipHeight } = tooltip
            .node()
            .getBoundingClientRect()

          let y = event.pageY + 15
          let x = event.pageX + 15

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

interface PmfPlotProps {
  dataset: Array<Array<PmfPlotItem>>
  config?: {
    height?: number | string
    color?: string | Array<string>
    showAxes?: boolean
    showXAxis?: boolean
    showYAxis?: boolean
    showLogScale?: boolean
    dataType?: ColumnType
  }
}

type PlotData = PmfPlotItem & { color: string }

export default PmfPlot
