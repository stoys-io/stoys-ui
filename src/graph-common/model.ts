import { JoinRatesData } from '../joinRates/model'
import { Dataset as ProfilerData } from '../profiler/model'
import { QualityData } from '../quality'
import { Node as Node0, Edge as Edge0 } from 'react-flow-renderer'
import { RawAggSumDataItemData } from '../aggSum/model'

export interface NodeDataPayload {
  label: string
  partitions: number
  violations: number
  columns: Column[]
}

// Same as React-flow Node, but the data is required
interface DataNode<T> extends Node0<T> {
  data: T
}

export interface Node extends DataNode<NodeDataPayload> {
  groupId?: string
  rootId?: string
}

export interface EdgeDataPayload {
  rank: number
}

interface DataEdge<T> extends Edge0<T> {
  data: T
}

export type Edge = DataEdge<EdgeDataPayload>

export interface Graph {
  nodes: Node[]
  edges: Edge[]
  release: string // We determine old/new graph state based on this field
}

export interface GraphExtended {
  graph: Graph
  highlights: Highlights
}

export interface Highlights {
  nodes: NodeStyle
  edges: EdgeStyle
}

interface NodeStyle {
  [key: string]: { color: string } | undefined
}

interface EdgeStyle {
  [key: string]: EdgeStyleProps | undefined
}

interface EdgeStyleProps {
  stroke: string
  strokeWidth: string
}

export type Highlight = 'none' | 'nearest' | 'parents' | 'children' | 'metrics' | 'diffing'

export type TableMetric = 'none' | 'violations' | 'partitions'
export type ColumnMetric =
  | 'none'
  | 'data_type'
  | 'count'
  | 'count_empty'
  | 'count_nulls'
  | 'count_unique'
  | 'count_zeros'
  | 'max_length'
  | 'min'
  | 'max'
  | 'mean'

export interface DataGraph {
  id: string
  name: string
  version: string
  tables: Table[]
  bubbleSets?: BubbleSets
}

interface BubbleSets {
  [key: string]: string[]
}

export interface Table {
  id: string
  name: string
  columns: Column[]
  measures?: {
    rows: number
    violations?: number
  }
  dependencies?: string[]
  dp_result?: ProfilerData
  dq_result?: QualityData
  dq_join_results?: JoinRatesData[]
  aggSum?: RawAggSumDataItemData[]
  metadata?: {
    [key: string]: string | number
  }
  style?: { color: string }

  groupId?: string
  rootId?: string
}

export interface Column {
  id: string
  name: string
  dependencies?: Array<string>
  style?: { color?: string }
  metrics?: NodeColumnsMetrics
}

interface NodeColumnsMetrics {
  data_type?: NodeColumnDataType
  count?: number
  count_empty?: number
  count_nulls?: number
  count_unique?: number
  count_zeros?: number
  max_length?: number
  min?: string
  max?: string
  mean?: number
}

export interface NodeColumnDataType {
  type: string
  nullable: boolean
}

export type Orientation = 'horizontal' | 'vertical'

type D3Scale =
  | 'interpolateBrBG'
  | 'interpolatePRGn'
  | 'interpolatePiYG'
  | 'interpolatePuOr'
  | 'interpolateRdBu'
  | 'interpolateRdGy'
  | 'interpolateRdYlBu'
  | 'interpolateRdYlGn'
  | 'interpolateSpectral'
  | 'interpolateBlues'
  | 'interpolateGreens'
  | 'interpolateGreys'
  | 'interpolateOranges'
  | 'interpolatePurples'
  | 'interpolateReds'
  | 'interpolateTurbo'
  | 'interpolateViridis'
  | 'interpolateInferno'
  | 'interpolateMagma'
  | 'interpolatePlasma'
  | 'interpolateCividis'
  | 'interpolateWarm'
  | 'interpolateCool'
  | 'interpolateRainbow'
  | 'interpolateSinebow'
  | 'interpolateCubehelixDefault'
  | 'interpolateBuGn'
  | 'interpolateBuPu'
  | 'interpolateGnBu'
  | 'interpolateOrRd'
  | 'interpolatePuBuGn'
  | 'interpolatePuBu'
  | 'interpolatePuRd'
  | 'interpolateRdPu'
  | 'interpolateYlGnBu'
  | 'interpolateYlGn'
  | 'interpolateYlOrBr'
  | 'interpolateYlOrRd'

export type ChromaticScale = D3Scale
