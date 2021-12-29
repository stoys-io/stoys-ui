import React from 'react'

import { Column } from '../profiler/model'

const ProfilerSummary = ({ data }: { data: Column }): JSX.Element => {
  const { data_type: type, name, count, count_nulls: nulls } = data

  if (type === 'string') {
    const { items } = data

    const percentageItems =
      items?.map(item => {
        return { ...item, percentage: Math.round((100 * item.count) / count) }
      }) || []
    percentageItems.sort((a, b) => b.count - a.count)

    const [value0, value1, value2, ...otherValues] = percentageItems

    return (
      <div>
        {name} {type} <br />
        {value0.item}: {value0.percentage}% <br />
        {value1.item}: {value1.percentage}% <br />
        {value2.item}: {value2.percentage}% <br />
        {otherValues.length ? `${otherValues.length} other values` : ''}
      </div>
    )
  }

  return (
    <>
      {name} {type}
    </>
  )
}

export default ProfilerSummary
