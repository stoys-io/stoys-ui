import React, { useMemo, useCallback } from 'react'

import { getJoinRatesColumns } from './columns'
import { StyledJoinStatistics } from './styles'
import { JoinStatisticsData, JoinStatisticsProps } from './model'

const JoinStatistics = ({
  data,
  columns,
  joinRateId,
  onRowClickHandler,
  smallSize,
}: JoinStatisticsProps): JSX.Element => {
  const _columns = useMemo(() => getJoinRatesColumns(columns), [data])

  const getRowClassName = useCallback(
    (dataItem: JoinStatisticsData | {}) => {
      if ('id' in dataItem && dataItem.id === joinRateId) {
        return 'selected-row'
      }

      return ''
    },
    [joinRateId]
  )

  const _onRow = useCallback(
    (dataItem: JoinStatisticsData | {}) => ({
      onClick: () => {
        if ('id' in dataItem) {
          onRowClickHandler(dataItem.id)
        }
      },
    }),
    [onRowClickHandler]
  )

  return (
    <StyledJoinStatistics
      sticky
      smallSize={smallSize}
      columns={_columns}
      dataSource={data}
      pagination={false}
      rowClassName={getRowClassName}
      onRow={_onRow}
    />
  )
}

export default JoinStatistics
