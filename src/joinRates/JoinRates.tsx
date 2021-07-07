import React, { useMemo, useState, useCallback } from 'react'

import { Quality } from '../quality/Quality'
import JoinRatesTable from './JoinRatesTable'
import { getTableNames, parseJson, transformJoinRatesData } from './helpers'
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
  const JoinRatesTableColumns = useMemo(() => {
    const columns = Array.isArray(data)
      ? Object.keys(
          data.reduce(
            (acc: any, dataItem) => ({
              ...getTableNames(dataItem.tableNames),
              ...acc,
              ...parseJson(dataItem.dq_join_statistics),
            }),
            {}
          )
        )
      : Object.keys({
          ...getTableNames(data.tableNames),
          ...parseJson(data.dq_join_statistics),
        })
    return columns
  }, [data])
  const joinRatesDqData = useMemo(() => {
    const dqData = Array.isArray(data)
      ? data[data.findIndex(dataItem => _id === dataItem.id)].dq_result
      : data.dq_result

    return typeof dqData === 'string' ? JSON.parse(dqData) : dqData
  }, [data, _id])
  const _onRowClickHandler = useCallback(
    (id: string): void => {
      if (onRowClickHandler) {
        onRowClickHandler(id)
      }

      _setId(id)
    },
    [onRowClickHandler, _setId]
  )

  return (
    <>
      <JoinRatesTable
        data={joinRatesData}
        columns={JoinRatesTableColumns}
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
