import React, { CSSProperties } from 'react'

const DiffMetric = ({ value, valueFormatted }: Props) => {
  const color = value === 0 ? null : value < 0 ? 'red' : 'green'
  const sign = value <= 0 ? '' : '+'

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

export default DiffMetric

export interface Props {
  value: number
  valueFormatted: string
}

const diffMetricStyle: CSSProperties = { marginLeft: '.2em' }
