import { DqJoinStatistics, JoinRatesData, JoinRatesTableData } from "./model"

export function getTableNames(tableNames?: Array<string>): { 'Table names': Array<string> } | {} {
  return tableNames ? { 'Table names': tableNames } : {}
}

export function parseDqJoinStatistics(dqJoinStatistics: DqJoinStatistics | string): DqJoinStatistics {
  return typeof dqJoinStatistics === 'string' ? JSON.parse(dqJoinStatistics) : dqJoinStatistics
}

export function transformJoinRatesData(dataItem: JoinRatesData): JoinRatesTableData {
  return {
    key: dataItem.id,
    id: dataItem.id,
    ...getTableNames(dataItem.tableNames),
    ...parseDqJoinStatistics(dataItem.dq_join_statistics),
  }
}