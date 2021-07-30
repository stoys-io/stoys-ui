import React, { useMemo, useState, useCallback, useEffect } from 'react'

import { Quality } from '../quality/Quality'
import JoinStatistics from './JoinStatistics'
import { getTableNames, transformJoinRatesData } from './helpers'
import { JoinRatesProps } from './model'

const JoinRates = ({
  data,
  joinRateId,
  onRowClickHandler,
  selectedRules,
  selectRules,
  mode,
  setMode,
  pagination,
  smallSize = true,
}: JoinRatesProps): JSX.Element => {
  const [_id, _setId] = useState<string>(joinRateId || (Array.isArray(data) ? data[0].id : data.id))
  const joinRatesData = useMemo(
    () =>
      Array.isArray(data)
        ? data.map(dataItem => transformJoinRatesData(dataItem))
        : [transformJoinRatesData(data)],
    [data]
  )
  const JoinStatisticsColumns = useMemo(() => {
    const columns = Array.isArray(data)
      ? Object.keys(
          data.reduce(
            (acc: any, dataItem) => ({
              ...getTableNames(dataItem.dq_join_info),
              ...acc,
              ...dataItem.dq_join_statistics,
            }),
            {}
          )
        )
      : Object.keys({
          ...getTableNames(data.dq_join_info),
          ...data.dq_join_statistics,
        })
    return columns
  }, [data])
  const joinRatesDqData = useMemo(
    () =>
      (Array.isArray(data) ? data[data.findIndex(dataItem => _id === dataItem.id)] : data)
        .dq_result,
    [data, _id]
  )
  const _onRowClickHandler = useCallback(
    (id: string): void => {
      if (onRowClickHandler) {
        onRowClickHandler(id)
      }

      _setId(id)
    },
    [onRowClickHandler, _setId]
  )

  useEffect(() => {
    if (joinRateId) {
      _setId(joinRateId)
    }
  }, [joinRateId, _setId])

  return (
    <>
      <JoinStatistics
        data={joinRatesData}
        columns={JoinStatisticsColumns}
        joinRateId={_id}
        onRowClickHandler={_onRowClickHandler}
      />
      <Quality
        data={joinRatesDqData}
        mode={mode}
        onModeChange={setMode}
        selectedRules={selectedRules}
        onSelectedRulesChange={selectRules}
        pagination={pagination}
        smallSize={smallSize}
      />
    </>
  )
}

export default JoinRates
