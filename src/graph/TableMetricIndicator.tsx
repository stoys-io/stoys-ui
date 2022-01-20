import React, { CSSProperties } from 'react'
import { TableMetric } from '../graph-common/model'
import { renderNumericValue } from '../helpers'

const TableMetricComponent = ({ tableMetric, baseMetricData, currentMetricData }: Props) => {
  const metricFormatted = tableMetric === 'none' ? null : format(baseMetricData[tableMetric])
  const isDiffMetric = currentMetricData && tableMetric !== 'none'

  return (
    <div>
      <span>{metricFormatted}</span>
      {isDiffMetric && (
        <DiffMetric value={currentMetricData[tableMetric] - baseMetricData[tableMetric]} />
      )}
    </div>
  )
}

export default TableMetricComponent

export interface Props {
  tableMetric: TableMetric
  baseMetricData: ValidMetricData
  currentMetricData?: ValidMetricData
}

type ValidMetricData = Omit<MetricData, 'none'>
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
