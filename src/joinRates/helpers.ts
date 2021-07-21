import { JoinRatesData, JoinStatisticsData } from './model'

export function getTableNames(tableNames?: Array<string>): { 'Table names': Array<string> } | {} {
  return tableNames ? { 'Table names': tableNames } : {}
}

export function transformJoinRatesData(dataItem: JoinRatesData): JoinStatisticsData {
  return {
    key: dataItem.id,
    id: dataItem.id,
    ...dataItem.dq_join_statistics,
    ...getTableNames(dataItem.tableNames),
  }
}
