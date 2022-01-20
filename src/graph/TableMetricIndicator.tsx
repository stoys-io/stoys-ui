import React, { CSSProperties } from 'react'
import { TableMetric } from '../graph-common/model'
import { renderNumericValue } from '../helpers'

const TableMetricComponent = ({ tableMetric, metricData, diffMetricData }: Props) => {
  const metricFormatted = tableMetric === 'none' ? null : format(metricData[tableMetric])
  const isDiffMetric = diffMetricData && tableMetric !== 'none'

  return (
    <div>
      <span>{metricFormatted}</span>
      {isDiffMetric && <DiffMetric value={diffMetricData[tableMetric]} />}
    </div>
  )
}

export default TableMetricComponent

export interface Props {
  tableMetric: TableMetric
  metricData: Omit<MetricData, 'none'>
  diffMetricData?: Omit<MetricData, 'none'>
}

type MetricData = {
  [key in TableMetric]: number
}

const DiffMetric = ({ value }: { value: number }) => {
  const color = value === 0 ? null : value < 0 ? 'red' : 'green'
  const sign = value <= 0 ? '' : '+'

  const valueFormatted = format(value)
  const colorStyle = color ? { color } : {}

  return (
    <span style={diffMetricStyle}>
      (
      <span style={colorStyle}>
        {sign}
        {valueFormatted}
      </span>
      )
    </span>
  )
}

const diffMetricStyle: CSSProperties = { marginLeft: '.2em' }

const fmtHelper = renderNumericValue(2, true)
const format = (val: number) => fmtHelper(val)
