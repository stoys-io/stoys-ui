import { PaginationProps } from '../hooks'

export interface Column {
  name: string
}

export interface Rule {
  name: string
  expression: string
  description?: string | null
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

export interface Data {
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

export type QualityProps = {
  data: Data
  mode?: Mode
  onModeChange?: (mode: Mode) => void
  selectedRules?: Array<string>
  onSelectedRulesChange?: (rules: Array<string>) => void
  pagination?: PaginationProps
  heightenedCell?: boolean
  smallSize?: boolean
  showReferencedColumns?: boolean
}

export type TableCellData = {
  metaData: {
    violations: Array<string>
    rules: Array<Rule>
  }
}

export type RuleData = RuleStatistic & {
  failureRatio: number
  description?: string | null
  expression?: string | null
  key: string
}

export interface RulesTableProps {
  rulesData: Array<RuleData>
  selectedRules: Array<string>
  setSelectRules: (rules: Array<string>) => void
  mode: Mode
  setMode: (mode: Mode) => void
  smallSize: boolean
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
  heightenedCell?: boolean
  smallSize: boolean
}

export interface RulesTableSwitchersProps {
  mode: Mode
  setMode: (mode: Mode) => void
  isCheckedFailtureRules: boolean
  setCheckedFailtureRules: (checked: boolean) => void
}
