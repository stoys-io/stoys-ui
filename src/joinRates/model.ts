import { Data, Mode } from '../quality/model'
import { PaginationProps } from '../hooks/model'

export interface DqJoinStatistics {
  left_rows: number
  right_rows: number
  left_nulls: number
  right_nulls: number
  left_distinct: number
  right_distinct: number
  inner: number
  left: number
  right: number
  full: number
  cross: number
}

export interface JoinRatesData {
  id: string
  tableNames?: Array<string>
  dq_join_statistics: DqJoinStatistics
  dq_result: Data
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
