import React from 'react'
import moment from 'moment'
import Tooltip from 'antd/lib/tooltip'

import { TrendsProps } from './model'
import { renderNumericValue } from '../helpers'
import { TrendsWrapper, BarWrapper, TrendBar, UppercaseValue } from './styles'

const Trends = ({ trends }: TrendsProps): JSX.Element => {
  const _trends = [...trends]
  _trends.sort((a, b) => {
    const aDate = 'releaseVersion' in a ? a.releaseVersion : a.date
    const bDate = 'releaseVersion' in b ? b.releaseVersion : b.date

    return new Date(aDate).getTime() - new Date(bDate).getTime()
  })
  _trends.splice(0, trends.length - 6)
  const maxValue = Math.max(..._trends.map(trend => trend.value))

  return (
    <TrendsWrapper>
      {_trends.map(trend => {
        const { value } = trend
        const date = 'releaseVersion' in trend ? trend.releaseVersion : trend.date
        const tooltipTitle = (
          <div>
            <UppercaseValue>{value ? renderNumericValue(2, true)(value) : 0}</UppercaseValue>
            <span> - {moment(date, 'YYYY-MM-DD').format('MMM DD, YYYY')}</span>
          </div>
        )
        const normalizedValue = Math.floor((value / maxValue) * 100) || 0

        return (
          <Tooltip key={date} title={tooltipTitle}>
            <BarWrapper>
              <TrendBar height={normalizedValue} data-testid={`bar-${value}`} />
            </BarWrapper>
          </Tooltip>
        )
      })}
    </TrendsWrapper>
  )
}

export default Trends
