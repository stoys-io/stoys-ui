import { Data } from '../quality/model'
import { DqJoinStatistics, JoinRatesData, JoinRatesTableData } from './model'

export function getTableNames(tableNames?: Array<string>): { 'Table names': Array<string> } | {} {
  return tableNames ? { 'Table names': tableNames } : {}
}

export function parseDqResult(dataItem: JoinRatesData): Data {
  return 'dq_result' in dataItem ? dataItem.dq_result : JSON.parse(dataItem.dqJoinResultJson)
}

export function parseDqJoinStatistics(dataItem: JoinRatesData): DqJoinStatistics {
  return 'dq_join_statistics' in dataItem
    ? dataItem.dq_join_statistics
    : JSON.parse(dataItem.dqJoinStatisticsJson)
}

export function transformJoinRatesData(dataItem: JoinRatesData): JoinRatesTableData {
  return {
    key: dataItem.id,
    id: dataItem.id,
    ...getTableNames(dataItem.tableNames),
    ...parseDqJoinStatistics(dataItem),
  }
}
