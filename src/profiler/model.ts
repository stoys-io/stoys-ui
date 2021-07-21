import { ColumnsType } from 'antd/lib/table/interface'
import { PaginationProps } from '../hooks'

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

export interface Column {
  name: string
  data_type: ColumnType
  count: number
  count_nulls: number
  count_empty: number | null
  count_zeros: number | null
  count_unique: number | null
  max_length: number | null
  mean: number | null
  min: string | null
  max: string | null
  pmf?: Array<PmfPlotItem>
  items?: Array<DiscreteItem>
}

export interface Dataset {
  table: { rows: number }
  columns: Array<Column>
}

export type Datasets = Array<Dataset>

export interface ToolbarOptions {
  logarithmicScaleOptions?: {
    isCheckboxShown?: boolean
    isUsedByDefault?: boolean
  }
  axisOptions?: {
    isCheckboxShown?: boolean
    isUsedByDefault?: boolean
  }
  chartTableOptions?: {
    isCheckboxShown?: boolean
    isUsedByDefault?: boolean
  }
}

export interface DataProfilerProps {
  datasets: Datasets
  orientOptions?: {
    type?: Orient
    isCheckboxShown?: boolean
    onModeChange?: (mode: Orient) => void
  }
  colors?: Array<string>
  toolbarOptions?: null | false | ToolbarOptions
  pagination?: PaginationProps
  smallSize?: boolean
  searchOptions?: {
    disabled?: boolean
    onChangeHandler?: (value: string) => void
  }
}

export interface HydratedColumn extends Column {
  key: string
  color: string
}

interface CellProps {
  colSpan?: number
  rowSpan?: number
}
export interface RenderedCellConfig {
  children: number | string | JSX.Element | null
  props: CellProps
}

export type Render = (
  logarithmicScale: LogarithmicScale,
  axisOptions: AxisOptions,
  tableOptions: TableOptions
) => (value: number | string, row: DataItem | ChildDataItem, index: number) => RenderedCellConfig

export interface LogarithmicScale {
  isCheckboxShown: boolean
  setChecked: (isChecked: boolean) => void
}

export interface AxisOptions {
  setChecked: (isChecked: boolean) => void
  isCheckboxShown: boolean
}

export interface TableOptions {
  setChecked?: (isChecked: boolean) => void
  isCheckboxShown: boolean
  isUsedByDefault?: boolean
}

export interface ChildDataItem extends Omit<HydratedColumn, 'name'> {
  parent: string
}

export interface DataItem {
  columnName: string
  key: string
  children: Array<ChildDataItem>
}

export interface TableProps {
  data: Array<DataItem>
  columns: ColumnsType<DataItem | ChildDataItem>
  currentPage: number
  pageSize: number
  setCurrentPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  withoutPagination: boolean
}

export interface VerticalTableProps extends TableProps {
  rowOptions: RowOptions
  tableOptions: TableOptions
}

export interface HygratePmfPlotDataItem {
  pmf?: Array<PmfPlotItem>
  items?: Array<DiscreteItem>
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
  haveAxis: boolean
}

export interface ChartWithTooltipProps {
  data: Array<HygratePmfPlotDataItem> | null
  smallSize?: boolean
  isHorizontal?: boolean
}

export interface RowOptions {
  isLogCheckboxShown: boolean
  isAxisCheckboxShown: boolean
}
export interface TableSubheaderRowProps {
  row: DataItem
  rowOptions: RowOptions
  tableOptions: TableOptions
}

export interface ChartTableHeaderProps {
  logarithmicScale: LogarithmicScale
  children: JSX.Element
  axisOptions: AxisOptions
}

export interface ChartHeaderCellTitleProps {
  logarithmicScale: LogarithmicScale
  axisOptions: AxisOptions
  tableOptions: TableOptions
}

export interface CheckedRowsContextProps {
  checkedLogRows: Array<string>
  setCheckedLogRows: (checkedLogRows: Array<string>) => void
  checkedAxisRows: Array<string>
  setCheckedAxisRows: (checkedAxisRows: Array<string>) => void
  checkedTableRows: Array<string>
  setCheckedTableRows: (checkedTableRows: Array<string>) => void
  dataLength: number
}

export interface TableChartData {
  key: string
  item: string
  count: number
  color: string
}

export interface HeaderCheckboxProps {
  isPartiallyChecked: boolean
  setChecked: (isChecked: boolean) => void
  isChecked: boolean
  title: string | JSX.Element
}

export interface ModeSwitcherProps {
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

export interface ChartTableProps {
  data: Array<HygratePmfPlotDataItem>
  height: number
}

export interface RenderChartProps {
  checkedLogRows: Array<string>
  checkedAxisRows: Array<string>
  checkedTableRows: Array<string>
  isHorizontal: boolean
  smallSize: boolean
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
}
