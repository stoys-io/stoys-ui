import React, { useMemo } from 'react'
import { getJoinRatesColumns } from './columns'
import { StyledJoinStatistics } from './styles'
import { JoinStatisticsProps } from './model'

const JoinStatistics = ({
  data,
  columns,
  joinRateId,
  onRowClickHandler,
}: JoinStatisticsProps): JSX.Element => {
  const _columns = useMemo(() => getJoinRatesColumns(columns), [data])

  return (
    <StyledJoinStatistics
      columns={_columns}
      dataSource={data}
      pagination={false}
      rowClassName={(record: any) => (record.id === joinRateId ? 'selected-row' : '')}
      onRow={(record: any) => ({
        onClick: () => {
          onRowClickHandler(record.id)
        },
      })}
    />
  )
}

export default JoinStatistics
