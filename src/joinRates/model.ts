import { Data, Mode } from '../quality/model'
import { PaginationProps } from '../hooks/model'

export interface DqJoinStatistics {
  [key: string]: number | string
}

export interface BaseJoinRatesData {
  id: string
  tableNames?: Array<string>
}
export interface JoinRatesJsonData extends BaseJoinRatesData {
  dqJoinStatisticsJson: string
  dqJoinResultJson: string
}

export interface JoinRatesObjectData extends BaseJoinRatesData {
  dq_join_statistics: DqJoinStatistics
  dq_result: Data
}

export type JoinRatesData = JoinRatesJsonData | JoinRatesObjectData

export interface JoinRatesProps {
  data: JoinRatesData | Array<JoinRatesData>
  joinRateId?: string
  onRowClickHandler?: (id: string) => void
  selectedRules?: Array<string>
  selectRules?: any
  mode?: Mode
  setMode?: any
  pagination?: PaginationProps
  smallSize?: boolean
}

export interface JoinRatesTableData {
  key: string
  id: string
  'Table names'?: Array<string>
  [key: string]: number | string | Array<string> | undefined
}
export interface JoinRatesTableProps {
  data: Array<JoinRatesTableData>
  columns: any
  joinRateId: string
  onRowClickHandler: any
}
