import { ReactNode } from 'react'
import { RadioChangeEvent } from 'antd/lib/radio'

import { PaginationProps } from '../hooks'
import { TableProps } from 'antd/lib/table'

export type Maybe<T> = T | null

export type ColumnNode = {
  title: string
  columnName: string
}

export type TableCellNode = {
  columnName: string
  currentValue?: Maybe<string | number>
  previousValue?: Maybe<string | number>
  threshold?: Maybe<number>
  trends?: Maybe<Array<TrendNode>>
}

export interface Trend {
  value: number
}

export type TrendNode = (
  | {
      releaseVersion: string
    }
  | { date: string }
) &
  Trend

export interface ColumnType {
  id: string
  key: string
  dataIndex: string
  title: string | ReactNode
  titleString?: string
  fixed?: string
  sorter?: (a: any, b: any) => 1 | -1
  render?: (value: any, item: any) => string | ReactNode
  children?: Array<ChildrenColumnType>
}

export interface ChildrenColumnType extends Omit<ColumnType, 'children'> {
  disabled?: boolean
}

export interface KeyValueInput {
  key: string
  value: string
}

export interface MetricsData {
  columns?: Array<ColumnNode>
  values: Array<Array<TableCellNode>>
}

export type SaveMetricThreshold = (
  updatedThreshold: number | null | undefined,
  keyColumnsWithValue: Array<KeyValueInput>,
  valueColumnName: string
) => void

export interface MetricsTableProps extends TableProps<any> {
  data: MetricsData
  columns?: any
  isLoading?: boolean
  previousReleaseDataIsShown?: boolean
  saveMetricThreshold?: SaveMetricThreshold
  pagination?: false | PaginationProps
  disabledColumns?: Array<string>
  height?: string | number
  smallSize?: boolean
}

export interface SorterValue {
  [key: string]: number
}

export interface MetricsTableData {
  [key: string]: Maybe<string | number | Array<TrendNode>> | undefined
}

export type TrendsProps = {
  trends: TrendNode[]
}

export type ModalRadioGroupProps = {
  keyColumn: ColumnNode
  metricsDataItem: {
    [key: string]: string | number | Array<{ [key: string]: string | number }>
  }
  onChangeHandler: (e: RadioChangeEvent, key: string) => void
}

export type ThresholdProps = {
  threshold: number
  keyColumns: ColumnNode[]
  metricsDataItem: {
    [key: string]: string
  }
  valueColumnName: string
  saveMetricThreshold?: any
}
