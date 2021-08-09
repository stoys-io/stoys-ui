import { DqJoinInfo, JoinRatesData, JoinStatisticsData } from './model'

export function getTableNames(dqJoinInfo: DqJoinInfo): { 'Table names': Array<string> } {
  return { 'Table names': [dqJoinInfo.left_table_name, dqJoinInfo.right_table_name] }
}

export function transformJoinRatesData(dataItem: JoinRatesData): JoinStatisticsData {
  return {
    key: dataItem.id,
    id: dataItem.id,
    ...dataItem.dq_join_statistics,
    ...getTableNames(dataItem.dq_join_info),
  }
}
