import React from 'react'
import * as d3 from 'd3'

import useD3 from './useD3'

const BarChart = ({ data }: any) => {
  const height = 500 // TODO: move to config
  const width = 1000
  console.log(data)

  const ref = useD3((svg: any) => {
    const lowValues = data.map((item: any) => item.low)
    const minValue = Math.min(...lowValues)

    const highValues = data.map((item: any) => item.high)
    const maxValue = Math.max(...highValues)

    const barSimpleWidth = width / (maxValue - minValue)

    const counts = data.map((item: any) => item.count)
    const maxCount = Math.max(...counts)
    const minCount = Math.min(...counts)
    const barSimpleHeight = height / (maxCount - minCount)

    console.log('values => ', minValue, maxValue, barSimpleWidth)
    console.log('counts => ', minCount, maxCount, barSimpleHeight)
    svg
      .append('g')
      .attr('fill', '#3c763d')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('width', (item: any) => {
        return (item.high - item.low) * barSimpleWidth
      })
      .attr('height', function (data: any) {
        return data.count * barSimpleHeight
      })
      .attr('x', function (data: any, i: number) {
        return (data.low - minValue) * barSimpleWidth
      })
      .attr('y', function (data: any) {
        return height - data.count * barSimpleHeight
      })
  }, [])

  return (
    <svg
      ref={ref as any}
      style={{
        height,
        width,
        marginRight: '0px',
        marginLeft: '0px',
      }}
    />
  )
}

export default BarChart
