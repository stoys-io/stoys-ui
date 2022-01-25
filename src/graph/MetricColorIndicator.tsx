import React, { CSSProperties } from 'react'

const MetricColorIndicator = ({ value, prevValue, valueFormatted }: Props) => {
  if (typeof value !== 'number' || typeof prevValue !== 'number') {
    return <span style={style}>({valueFormatted})</span>
  }

  const color = value === 0 ? null : value < prevValue ? 'red' : 'green'
  const colorStyle = color ? { color } : {}

  return (
    <span style={style}>
      (<span style={colorStyle}>{valueFormatted}</span>)
    </span>
  )
}

export default MetricColorIndicator

export interface Props {
  value: any
  prevValue: any
  valueFormatted: string
}

const style: CSSProperties = { marginLeft: '.2em' }
