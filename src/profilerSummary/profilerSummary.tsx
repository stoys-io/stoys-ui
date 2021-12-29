import React from 'react'

import PmfPlot from '../pmfPlot'
import { ProfilerSummaryProps } from './model'

const ProfilerSummary = ({ data, config = { rows: 3 } }: ProfilerSummaryProps): JSX.Element => {
  const { data_type: type, name, count, count_nulls, pmf } = data
  const nulls = count_nulls || 0
  const { rows } = config

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

    const visibleRows = percentageItems.slice(0, rows)
    const otherRows = percentageItems.slice(rows)

    return (
      <div>
        {name} {type} <br />
        {visibleRows.map(row => (
          <>
            {row.item}: {row.percentage}% <br />
          </>
        ))}
        {otherRows.length ? `${otherRows.length} other values` : ''}
      </div>
    )
  }

  if (pmf?.length) {
    return (
      <div>
        <PmfPlot dataset={[pmf]} config={{ height: 200 }} />
      </div>
    )
  }

  return (
    <>
      {name} {type}
    </>
  )
}

function getPercentageValue(value: number) {
  return Math.round(100 * value)
}

export default ProfilerSummary
