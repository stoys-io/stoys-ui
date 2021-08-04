import React, { useMemo, useState, useCallback, useEffect } from 'react'
import Empty from 'antd/lib/empty'

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
  const getJoinRateId = useCallback(() => {
    const _joinRateId = Array.isArray(data) ? data[0].id : data.id

    if (!joinRateId) {
      onRowClickHandler?.(_joinRateId)
      return _joinRateId
    }

    if (
      (!Array.isArray(data) && data.id === joinRateId) ||
      (Array.isArray(data) && data.filter(dataItem => dataItem.id === joinRateId).length)
    ) {
      return joinRateId
    }

    onRowClickHandler?.(_joinRateId)
    return _joinRateId
  }, [joinRateId, data])

  const [_id, _setId] = useState<string>(getJoinRateId)

  const [_selectedRules, _setSelectedRules] = useState<Array<string>>(selectedRules || [])

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

  const joinRatesDqData = useMemo(() => {
    const _joinRatesDqData = Array.isArray(data)
      ? data[data.findIndex(dataItem => _id === dataItem.id)]
      : data
    return _joinRatesDqData ? _joinRatesDqData.dq_result : null
  }, [data, _id])

  const _onRowClickHandler = useCallback(
    (id: string): void => {
      onRowClickHandler?.(id)
      selectRules?.([])

      _setSelectedRules([])
      _setId(id)
    },
    [onRowClickHandler, _setId]
  )

  const _selectRules = useCallback(
    (rules: Array<string>): void => {
      _setSelectedRules(rules)
      selectRules?.(rules)
    },
    [selectRules, _setSelectedRules]
  )

  useEffect(() => {
    if (joinRateId) {
      _setId(joinRateId)
    }
  }, [joinRateId, _setId])

  useEffect(() => {
    _setSelectedRules(selectedRules || [])
  }, [selectedRules])

  return (
    <>
      <JoinStatistics
        data={joinRatesData}
        columns={JoinStatisticsColumns}
        joinRateId={_id}
        onRowClickHandler={_onRowClickHandler}
      />
      {joinRatesDqData ? (
        <Quality
          data={joinRatesDqData}
          mode={mode}
          onModeChange={setMode}
          selectedRules={_selectedRules}
          onSelectedRulesChange={_selectRules}
          pagination={pagination}
          smallSize={smallSize}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </>
  )
}

export default JoinRates
