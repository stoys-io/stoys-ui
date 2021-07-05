import React, { useMemo } from 'react'
import { getJoinRatesColumns } from './columns'
import { StyledJoinRatesTable } from './styles'
import { JoinRatesTableProps } from './model'

const JoinRatesTable = ({
  data,
  columns,
  joinRateId,
  onRowClickHandler,
}: JoinRatesTableProps): JSX.Element => {
  const _columns = useMemo(() => getJoinRatesColumns(columns), [data])

  return (
    <StyledJoinRatesTable
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

export default JoinRatesTable
