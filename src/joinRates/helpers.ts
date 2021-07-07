import { JoinRatesData, JoinRatesTableData } from './model'

export function getTableNames(tableNames?: Array<string>): { 'Table names': Array<string> } | {} {
  return tableNames ? { 'Table names': tableNames } : {}
}

export function parseJson<T>(maybeJson: T | string): T {
  return typeof maybeJson === 'string' ? JSON.parse(maybeJson) : maybeJson
}

export function transformJoinRatesData(dataItem: JoinRatesData): JoinRatesTableData {
  return {
    key: dataItem.id,
    id: dataItem.id,
    ...getTableNames(dataItem.tableNames),
    ...parseJson(dataItem.dq_join_statistics),
  }
}
