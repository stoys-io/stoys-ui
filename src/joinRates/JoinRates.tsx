import React, { useMemo, useState, useCallback } from 'react'

import JoinRatesTable from './JoinRatesTable'
import { JoinRatesProps } from './model'
import { Quality } from '../quality/Quality'

function getTableNames(tableNames?: Array<string>): { 'Table names': Array<string> } | {} {
  return tableNames ? { 'Table names': tableNames } : {}
}

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
        ? data.map(dataItem => ({
            key: dataItem.id,
            id: dataItem.id,
            ...getTableNames(dataItem.tableNames),
            ...dataItem.dq_join_statistics,
          }))
        : [
            {
              key: data.id,
              id: data.id,
              ...getTableNames(data.tableNames),
              ...data.dq_join_statistics,
            },
          ],
    [data]
  )
  const JoinRatesTableColumns = useMemo(() => {
    const columns = Array.isArray(data)
      ? Object.keys(
          data.reduce(
            (acc: any, dataItem) => ({
              ...getTableNames(dataItem.tableNames),
              ...acc,
              ...dataItem.dq_join_statistics,
            }),
            {}
          )
        )
      : Object.keys({
          ...getTableNames(data.tableNames),
          ...data.dq_join_statistics,
        })
    return columns
  }, [data])
  const joinRatesDqData = useMemo(
    () =>
      Array.isArray(data)
        ? data[data.findIndex(dataItem => _id === dataItem.id)].dq_result
        : data.dq_result,
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

  return (
    <>
      <JoinRatesTable
        data={joinRatesData as any}
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
