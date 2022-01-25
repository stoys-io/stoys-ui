import React from 'react'
import { TableMetric } from '../graph-common/model'
import { renderNumericValue } from '../helpers'
import MetricColorIndicator from './MetricColorIndicator'

const TableMetricComponent = ({ tableMetric, baseMetricData, currentMetricData }: Props) => {
  const baseMetricFormatted = tableMetric === 'none' ? null : format(baseMetricData[tableMetric])
  const showOtherMetric = currentMetricData && tableMetric !== 'none'

  return (
    <div>
      <span>{baseMetricFormatted}</span>
      {showOtherMetric && (
        <MetricColorIndicator
          value={currentMetricData[tableMetric]}
          prevValue={baseMetricData[tableMetric]}
          valueFormatted={format(currentMetricData[tableMetric])}
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
