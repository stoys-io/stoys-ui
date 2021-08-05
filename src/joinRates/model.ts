import { QualityData, Mode } from '../quality/model'
import { PaginationProps } from '../hooks/model'

export interface DqJoinInfo {
  left_table_name: string
  right_table_name: string
  left_key_column_names: Array<string>
  right_key_column_names: Array<string>
  join_type: string
  join_condition: string
}

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
  dq_join_info: DqJoinInfo
  dq_join_statistics: DqJoinStatistics
  dq_result: QualityData
}

export interface JoinRatesProps {
  data: JoinRatesData | Array<JoinRatesData>
  joinRateId?: string
  onRowClickHandler?: (id: string) => void
  selectedRules?: Array<string>
  selectRules?: (rules: Array<string>) => void
  mode?: Mode
  setMode?: (mode: Mode) => void
  pagination?: PaginationProps
  smallSize?: boolean
}

export interface JoinStatisticsData {
  key: string
  id: string
  'Table names'?: Array<string>
  [key: string]: number | string | Array<string> | undefined
}
export interface JoinStatisticsProps {
  data: Array<JoinStatisticsData>
  columns: any
  joinRateId: string
  onRowClickHandler: any
  smallSize: boolean
}
