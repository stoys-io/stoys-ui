import React from 'react'

import PmfPlot from '../pmfPlot'
import { ProfilerSummaryProps } from './model'
import CardTitle from './CardTitle'
import { ProfilerSummaryItems, ProfilerSummaryWrapper } from './styles'

const ProfilerSummary = ({ data, config }: ProfilerSummaryProps): JSX.Element => {
  const { data_type: type, name, count, count_nulls, pmf } = data
  const nulls = count_nulls || 0
  const rows = config.rows && config.rows > 2 ? config.rows : 3

  if (type === 'string') {
    const { items } = data

    const percentageItems =
      items?.map(item => {
        return { ...item, percentage: getPercentageValue(item.count / count) }
      }) || []
    percentageItems.push({
      percentage: getPercentageValue(nulls / count),
      item: 'null',
      count: nulls,
    })
    percentageItems.sort((a, b) => b.count - a.count)

    const visibleRows = percentageItems.slice(0, rows - 1)
    const otherRows = percentageItems.slice(rows - 1)

    return (
      <ProfilerSummaryWrapper>
        <CardTitle name={name} type={type} />
        <ProfilerSummaryItems>
          {visibleRows.map(row => (
            <li key={row.item}>
              {row.item}: {row.percentage}% <br />
            </li>
          ))}
          <li>{otherRows.length ? `${otherRows.length} other values` : ''}</li>
        </ProfilerSummaryItems>
      </ProfilerSummaryWrapper>
    )
  }

  if (pmf?.length) {
    return (
      <ProfilerSummaryWrapper>
        <CardTitle name={name} type={type} />
        <PmfPlot dataset={[pmf]} config={{ height: 200 }} />
      </ProfilerSummaryWrapper>
    )
  }

  return (
    <ProfilerSummaryWrapper>
      <CardTitle name={name} type={type} />
    </ProfilerSummaryWrapper>
  )
}

function getPercentageValue(value: number) {
  return Math.round(100 * value)
}

export default ProfilerSummary
