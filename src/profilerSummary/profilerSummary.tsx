import React from 'react'

import PmfPlot from '../pmfPlot'
import { ProfilerSummaryProps } from './model'
import CardTitle from './CardTitle'
import { ProfilerSummaryItems, ProfilerSummaryWrapper } from './styles'

const ProfilerSummary = ({ data, config = {} }: ProfilerSummaryProps): JSX.Element => {
  const { data_type: type, name, count, count_nulls, pmf } = data
  const nulls = count_nulls || 0
  const rows = config.rows && config.rows > 2 ? config.rows : 3

  const renderCard = () => {
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
        <>
          <CardTitle name={name} type={type} />
          <ProfilerSummaryItems>
            {visibleRows.map(row => (
              <li key={row.item}>
                {row.item}: {row.percentage}% <br />
              </li>
            ))}
            <li>{otherRows.length ? `${otherRows.length} other values` : ''}</li>
          </ProfilerSummaryItems>
        </>
      )
    }

    if (pmf?.length) {
      return (
        <>
          <CardTitle name={name} type={type} />
          <PmfPlot dataset={[pmf]} config={{ height: '100%', showXAxis: true, dataType: type }} />
        </>
      )
    }

    return <CardTitle name={name} type={type} />
  }

  return (
    <ProfilerSummaryWrapper height={config.height ? `${config.height}px` : 'auto'}>
      {renderCard()}
    </ProfilerSummaryWrapper>
  )
}

function getPercentageValue(value: number) {
  return Math.round(100 * value)
}

export default ProfilerSummary
