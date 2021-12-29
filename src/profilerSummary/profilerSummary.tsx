import React from 'react'

import { Column } from '../profiler/model'

const ProfilerSummary = ({ data, config = { rows: 3 } }: ProfilerSummaryProps): JSX.Element => {
  const { data_type: type, name, count, count_nulls: nulls } = data
  const { rows } = config

  if (type === 'string') {
    const { items } = data

    const percentageItems =
      items?.map(item => {
        return { ...item, percentage: Math.round((100 * item.count) / count) }
      }) || []
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

  return (
    <>
      {name} {type}
    </>
  )
}

interface ProfilerSummaryProps {
  data: Column
  config: { rows: number; height?: number }
}

export default ProfilerSummary
