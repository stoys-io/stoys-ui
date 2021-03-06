import { TableProps } from 'antd/lib/table'
import { PaginationProps } from '../hooks'
import { Maybe } from '../model'

export interface Column {
  name: string
}

export interface Rule {
  name: string
  expression: string
  description?: Maybe<string>
  referenced_column_names: Array<string>
}

export interface RuleStatistic {
  rule_name: string
  violations: number
}

export interface ColumnStatistic {
  column_name: string
  violations: number
}

export interface RowSample {
  row: Array<string>
  violated_rule_names: Array<string>
}

export interface QualityData {
  columns: Array<Column>
  rules: Array<Rule>
  row_sample: Array<RowSample>
  metadata: {}
  statistics: {
    column: Array<ColumnStatistic>
    table: { rows: number; violations: number }
    rule: Array<RuleStatistic>
  }
}

export type Mode = 'column' | 'row'

export type OnModeChange = (mode: Mode) => void

export interface ConfigProps {
  mode?: Mode
  onModeChange?: OnModeChange
  selectedRules?: Array<string>
  onSelectedRulesChange?: (rules: Array<string>) => void
  smallSize?: boolean
  showReferencedColumnsOnly?: boolean
  rulesTableProps?: TableProps<any>
  sampleTableProps?: TableProps<any>
  pagination?: PaginationProps | false
}

export type QualityProps = {
  data: QualityData
  config?: ConfigProps
}

export type TableCellData = {
  metaData: {
    violations: Array<string>
    rules: Array<Rule>
  }
}

export type RuleData = RuleStatistic & {
  failureRatio: number
  description?: Maybe<string>
  expression?: Maybe<string>
  key: string
}

export interface RulesTableProps {
  rulesData: Array<RuleData>
  selectedRules: Array<string>
  setSelectRules: (rules: Array<string>) => void
  mode: Mode
  setMode: (mode: Mode) => void
  smallSize: boolean
  tableProps: TableProps<any>
}

export interface SampleTableProps {
  sampleData: any
  sampleColumns: Array<{
    dataIndex: string
    ellipsis?: boolean
    render: (text: string, item: TableCellData) => JSX.Element
    sorter: (a: any, b: any) => 1 | -1
    title: JSX.Element | string
  }>
  currentPage: number
  pageSize: number
  setCurrentPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  withoutPagination?: boolean
  pagination?: PaginationProps | false
  smallSize: boolean
  showReferencedColumns: boolean
  setShowReferencedColumns: () => void
  tableProps: TableProps<any>
}

export interface RulesTableSwitchersProps {
  mode: Mode
  setMode: (mode: Mode) => void
  isCheckedFailtureRules: boolean
  setCheckedFailtureRules: (checked: boolean) => void
}
