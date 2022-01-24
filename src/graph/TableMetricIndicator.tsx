import React from 'react'
import { TableMetric } from '../graph-common/model'
import { renderNumericValue } from '../helpers'
import DiffMetric from './DiffMetric'

const TableMetricComponent = ({ tableMetric, baseMetricData, currentMetricData }: Props) => {
  const metricFormatted = tableMetric === 'none' ? null : format(baseMetricData[tableMetric])
  const isDiffMetric = currentMetricData && tableMetric !== 'none'

  return (
    <div>
      <span>{metricFormatted}</span>
      {isDiffMetric && (
        <DiffMetric
          value={currentMetricData[tableMetric] - baseMetricData[tableMetric]}
          valueFormatted={format(currentMetricData[tableMetric] - baseMetricData[tableMetric])}
        />
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

const fmtHelper = renderNumericValue(2, true)
const format = (val: number) => fmtHelper(val)
