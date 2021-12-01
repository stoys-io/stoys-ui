import React from 'react'
import * as d3 from 'd3'

import { useD3 } from '../hooks'
import { DiscreteItem } from '../profiler/model'
import { COLORS } from '../profiler/constants'
import { getMargin } from '../common/chartHelpers'

const BarChart = ({ dataset, config }: BarChartProps): JSX.Element => {
  const { height, color, showAxes, showLogScale } = config

  const margin = getMargin(showAxes)

  const chartData: Array<ChartDataItem> = dataset
    .map((data: Array<DiscreteItem>, index: number) => {
      return data.map((dataItem: DiscreteItem) => ({
        ...dataItem,
        color: (Array.isArray(color) ? color[index] : color) || COLORS[index],
      }))
    })
    .flat()

  const ref = useD3(
    svg => {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      const { width } = svg.node()!.getBoundingClientRect()

      const yType = showLogScale ? d3.scaleLog : d3.scaleLinear

      const xRange = [margin.left, width - margin.right]
      const yRange = [height - margin.bottom, margin.top]

      const X = d3.map(chartData, d => d.item)
      const Y = d3.map(chartData, d => d.count)

      const xDomain = new d3.InternSet(X)
      const yDomain = [showLogScale ? 1 : 0, d3.max(Y) as number]

      const I = d3.range(X.length).filter(i => xDomain.has(X[i]))

      const xScale = d3.scaleBand(xDomain, xRange).padding(0.025)
      const yScale = yType(yDomain, yRange)

      const body = d3.select('body')
      // TODO: fix tooltip type
      const tooltip: any = d3.select('.plot-tooltip').node()
        ? d3.select('.plot-tooltip')
        : body.append('div').style('pointer-events', 'none').attr('class', 'plot-tooltip')

      svg
        .call(zoom)
        .on('pointerenter pointermove', pointermoved)
        .on('pointerleave', () => tooltip.style('display', 'none').selectChildren().remove())

      let xAxis: d3.Axis<string>

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
          .call(g => g.select('.domain').remove())
          .call(g =>
            g
              .selectAll('.tick line')
              .clone()
              .attr('x2', width - margin.left - margin.right)
              .attr('stroke-opacity', 0.1)
          )
          .call(g =>
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
          .call(g =>
            g
              .append('text')
              .attr('x', width - margin.right)
              .attr('y', 27)
              .attr('fill', 'currentColor')
              .attr('text-anchor', 'end')
          )
      }

      const _height = showLogScale ? yScale(1) : yScale(0)

      svg
        .append('g')
        .selectAll('rect')
        .data(I)
        .join('rect')
        .attr('x', i => xScale(X[i])!)
        .attr('y', i => yScale(Y[i]))
        .attr('height', i => _height - yScale(Y[i]))
        .attr('width', xScale.bandwidth())
        .attr('fill', i => chartData[i].color)
        .style('mix-blend-mode', 'multiply')

      function pointermoved(event: any) {
        const [xCoordinate, yCoordinate] = d3.pointer(event) // [x, y]
        const scale = d3.scaleQuantize(xDomain).domain(xRange)
        const xValue = scale(xCoordinate)

        const tooltipValues = chartData.filter(value => value.item === xValue)

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
                    `<div>${colorBadge(value.color)} ${value.item} <b>${value.count}</b></div>`
                )
                .join('')
            })

          const { width: tooltipWidth, height: tooltipHeight } = tooltip
            .node()
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

      function zoom(_svg: any) {
        const extent: [[number, number], [number, number]] = [
          [margin.left, margin.top],
          [width - margin.right, height - margin.top],
        ]

        _svg.call(
          d3.zoom().scaleExtent([1, 8]).translateExtent(extent).extent(extent).on('zoom', zoomed)
        )

        function zoomed(event: any) {
          xScale.range([margin.left, width - margin.right].map(d => event.transform.applyX(d)))
          _svg
            .selectAll('rect')
            .attr('x', (i: number) => xScale(X[i]))
            .attr('width', xScale.bandwidth())

          if (xAxis) {
            _svg.selectAll('.x-axis').call(xAxis)
          }
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
