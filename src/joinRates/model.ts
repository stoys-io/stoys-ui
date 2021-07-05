import { Data, Mode } from '../quality/model'
import { PaginationProps } from '../hooks/model'

export interface DqJoinStatistics {
  [key: string]: number | string
}

export interface JoinRatesData {
  dq_join_statistics: DqJoinStatistics
  dq_result: Data
  id: string
  tableNames?: Array<string>
}

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

export interface JoinRatesTableProps {
  data: Array<DqJoinStatistics>
  columns: any
  joinRateId: string
  onRowClickHandler: any
}
