import { ReactNode } from 'react'
import { RadioChangeEvent } from 'antd/lib/radio'
import { TableProps } from 'antd/lib/table'

import { PaginationProps } from '../hooks'
import { Maybe } from '../model'

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
  fixed?: 'left' | 'right'
  align?: 'left' | 'right'
  sorter?: (a: any, b: any) => number
  render?: (value: any, item: any) => string | ReactNode
  children?: Array<ChildrenColumnType>
}

export interface ChildrenColumnType extends Omit<ColumnType, 'children'> {
  disabled?: boolean
  width?: number
}

export interface KeyValueInput {
  key: string
  value: string
}

export interface RawMetricsDataItem {
  table_name: string
  key_columns: Array<string>
  data: Array<{ [key: string]: Maybe<string | number> }>
}

export interface RawMetricsData {
  current: RawMetricsDataItem
  previous?: RawMetricsDataItem
}

export interface MetricsData {
  columns?: Array<ColumnNode>
  values: Array<Array<TableCellNode>>
}

export type SaveMetricThreshold = (
  updatedThreshold: Maybe<number> | undefined,
  keyColumnsWithValue: Array<KeyValueInput>,
  valueColumnName: string
) => void

export interface ConfigProps {
  columns?: Array<ColumnType>
  isLoading?: boolean
  previousReleaseDataIsShown?: boolean
  saveMetricThreshold?: SaveMetricThreshold
  pagination?: false | PaginationProps
  disabledColumns?: Array<string>
  height?: string | number
  smallSize?: boolean
}
export interface MetricsTableProps extends TableProps<any> {
  data: MetricsData | RawMetricsData
  config?: ConfigProps
}

export interface SorterValue {
  [key: string]: number
}

export interface MetricsTableData {
  [key: string]: Maybe<string | number | Array<TrendNode>> | undefined
}

export type TrendsProps = {
  trends: Array<TrendNode>
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
  keyColumns: Array<ColumnNode>
  metricsDataItem: {
    [key: string]: string
  }
  valueColumnName: string
  saveMetricThreshold?: SaveMetricThreshold
}
