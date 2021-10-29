import { ColumnsType } from 'antd/lib/table/interface'
import { TableProps as AntdTableProps } from 'antd/lib/table'

import { PaginationProps } from '../hooks'
import { Maybe } from '../model'

export enum Orient {
  Vertical = 'Vertical',
  Horizontal = 'Horizontal',
}

export interface PmfPlotItem {
  low: number
  high: number
  count: number
}

export interface DiscreteItem {
  item: string
  count: number
}

export type ColumnType =
  | 'integer'
  | 'float'
  | 'timestamp'
  | 'array'
  | 'string'
  | 'long'
  | 'double'
  | 'boolean'

export type CountColumnKey = `count_${string}`
export interface Column {
  name: string
  data_type: ColumnType
  data_type_json?: string
  nullable?: boolean
  enum_values?: Array<string>
  format?: Maybe<string>
  count: number
  [key: CountColumnKey]: Maybe<number>

  max_length: Maybe<number>
  mean: Maybe<number>
  min: Maybe<string>
  max: Maybe<string>
  pmf?: Array<PmfPlotItem>
  items?: Array<DiscreteItem>
  extras?: { [key: string]: string }
}

export interface Dataset {
  table: { rows: number }
  columns: Array<Column>
}

export type Datasets = Array<Dataset>

export interface ConfigProps {
  colors?: Array<string>
  smallSize?: boolean
  visibleColumns?: Array<string>
  pagination?: PaginationProps | false
  height?: string | number

  showProfilerToolbar?: boolean
  showRowToolbar?: boolean

  showOrientSwitcher?: boolean
  orientType?: Orient
  onOrientChange?: (orient: Orient) => void

  showJsonSwitcher?: boolean
  jsonChecked?: boolean
  onJsonChange?: (shown: boolean) => void

  /*TODO: make it in one way? 

    showSwitcher?: boolean
    checked?: boolean
    onChange: Function

    for search => searchValue?: string
  */
  showNormalizeSwitcher?: boolean
  normalizeChecked?: boolean

  showSearch?: boolean
  onSearchChange?: (value: string) => void

  showLogarithmicSwitcher?: boolean
  logarithmicChecked?: boolean

  showAxesSwitcher?: boolean
  axesChecked?: boolean

  showChartTableSwitcher?: boolean
  chartTableChecked?: boolean
}

export interface DataProfilerProps extends AntdTableProps<any> {
  datasets: Datasets
  config?: ConfigProps
}

export interface HydratedColumn extends Column {
  key: string
  color: string
}

interface CellProps {
  colSpan?: number
  rowSpan?: number
  className?: string
}
export interface RenderedCellConfig {
  children: Maybe<number | string | JSX.Element>
  props: CellProps
}

export type Render = (
  render: (value: Maybe<string | number>) => Maybe<JSX.Element | string>
) => (value: number | string, row: DataItem | ChildDataItem, index: number) => RenderedCellConfig

export interface LogarithmicScale {
  isCheckboxShown: boolean
  setChecked: (isChecked: boolean) => void
}

export interface AxesOptions {
  setChecked: (isChecked: boolean) => void
  isCheckboxShown: boolean
}

export interface ChildDataItem extends Omit<HydratedColumn, 'name'> {
  parent: string
}

export interface DataItemModel {
  columnName: string
  key: string
}

export type DataItem = DataItemModel | ChildDataItem

export interface TableProps extends AntdTableProps<any> {
  data: Array<DataItem>
  columns: ColumnsType<DataItem | ChildDataItem>
  currentPage: number
  pageSize: number
  setCurrentPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  withoutPagination: boolean
  pagination?: PaginationProps | false
  height?: string | number
}

export interface VerticalTableProps extends TableProps {
  // TODO: Remove. We already create a render function in getColumns for Horizontal Table
  displayNormalized: boolean
}

export interface HygratePmfPlotDataItem {
  pmf?: Array<PmfPlotItem>
  items?: Array<DiscreteItem>
  itemsTotalCount: number
  color: string
  name: string
  parent: string
  type: string
}

export interface BarChartProps {
  series: any
  xData: Array<number> | Array<string>
  height: number
  isLogScale: boolean
  haveAxes: boolean
}

export interface ChartAndTableProps {
  data: Maybe<Array<HygratePmfPlotDataItem>>
  isHorizontal?: boolean
  displayNormalized?: boolean
}

export interface TableSubheaderRowProps {
  row: DataItemModel
}

export interface ChartTableHeaderProps {
  logarithmicScale: LogarithmicScale
  children: JSX.Element
  axesOptions: AxesOptions
}

export interface CheckedRowsContextProps {
  checkedLogRows: Array<string>
  setCheckedLogRows: (checkedLogRows: Array<string>) => void
  checkedAxesRows: Array<string>
  setCheckedAxesRows: (checkedAxesRows: Array<string>) => void
  checkedTableRows: Array<string>
  setCheckedTableRows: (checkedTableRows: Array<string>) => void
  dataLength: number
}

export interface TableChartData {
  key: string
  item: string
  count: number
  color: string
  index: number
}

export interface HeaderCheckboxProps {
  isPartiallyChecked: boolean
  setChecked: (isChecked: boolean) => void
  isChecked: boolean
  title: string | JSX.Element
}

export interface SwitcherProps {
  checked: boolean
  onChange: () => void
}

export interface ChartCellTitleProps extends TableSubheaderRowProps {}

export interface VerticalColumn {
  title: string
  dataIndex: string
  key: string
  fixed?: 'left' | 'right'
  colSpan?: number
  render?: (text: any, record: any) => any
}

export interface VerticalData {
  [key: string]:
    | undefined
    | number
    | null
    | boolean
    | string
    | {}
    | { type: string; pmf: Array<PmfPlotItem>; items: Array<DiscreteItem> }
    | { type: string; value: string }
}

export interface ChartTableProps {
  data: Array<HygratePmfPlotDataItem>
  height: number
  displayNormalized?: boolean
}

export type CheckboxWithTitleProps = Omit<LogarithmicScale, 'isCheckboxShown'> & {
  isChecked: boolean
  title: string | JSX.Element
}

export interface ToolboxProps {
  showTableChartSwitcher?: boolean
  showLogScale?: boolean
  showAxes?: boolean
  activeTable?: boolean
  partiallyActiveTable?: boolean
  activeLogScale?: boolean
  partiallyActiveLogScale?: boolean
  activeAxes?: boolean
  partiallyActiveAxes?: boolean
  disableLogScale?: boolean
  disableAxes?: boolean
  onAxesClickHandler: (active: boolean) => void
  onLogScaleClickHandler: (active: boolean) => void
  onTableClickHandler: (active: boolean) => void
}
export interface TableSettingsProps {
  isModeSwitcherShown?: boolean
  isModeSwitcherChecked: boolean
  onModeChange: () => void
  isSearchShown: boolean
  onSearchChangeHandler: (value: string) => void

  isJsonSwitcherShown?: boolean
  isJsonSwitcherChecked: boolean
  onJsonChange: () => void

  isNormalizeSwitcherShown?: boolean
  isNormalizeSwitcherChecked: boolean
  onNormalizeChange: () => void
}

export interface JsonDrqwerProps {
  datasets: Datasets
  visible: boolean
  onClose: () => void
}
