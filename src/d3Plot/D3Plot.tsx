import React from 'react'
import * as d3 from 'd3'

import useD3 from './useD3'
import { COLORS } from '../profiler/constants'

const D3Plot = ({ dataset, config }: any) => {
  const { height, color } = config

  const ref = useD3((svg: any) => {
    const { width } = svg.node().getBoundingClientRect()
    const flattedData = dataset.flat()

    const lowValues = d3.map(flattedData, (item: any) => item.low)
    const minValue = d3.min(lowValues)

    const highValues = d3.map(flattedData, (item: any) => item.high)
    const maxValue = d3.max(highValues)

    const barSimpleWidth = width / (maxValue - minValue)

    const counts = d3.map(flattedData, (item: any) => item.count)
    const maxCount = d3.max(counts)
    const barSimpleHeight = (height * 0.95) / maxCount

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
          return (item.low - minValue) * barSimpleWidth
        })
        .attr('y', function (item: any) {
          return height - item.count * barSimpleHeight
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
