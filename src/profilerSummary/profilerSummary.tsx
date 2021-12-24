import React from 'react'

const ProfilerSummary = ({
  title,
  type,
  data,
}: {
  title: string
  type: 'string' | any
  data: Array<string>
}): JSX.Element => {
  if (type === 'string') {
    const dataLength = data.length
    const uniqueData = [...new Set(data)]

    if (dataLength === uniqueData.length) {
      return <div>{`${dataLength} unique values`}</div>
    }

    const percentageData: Array<{ item: string; percentage: number }> = uniqueData.map(dataItem => {
      const itemArr = data.filter(d => d === dataItem)

      return { item: dataItem, percentage: Math.round((100 * itemArr.length) / dataLength) }
    })

    percentageData.sort((a, b) => b.percentage - a.percentage)

    const [value0, value1, value2, ...otherValues] = percentageData

    return (
      <div>
        {title} {type} <br />
        {value0.item}: {value0.percentage}% <br />
        {value1.item}: {value1.percentage}% <br />
        {value2.item}: {value2.percentage}% <br />
        {otherValues.length ? `${otherValues.length} other values` : ''}
      </div>
    )
  }

  return (
    <>
      {title} {type}
    </>
  )
}

export default ProfilerSummary
