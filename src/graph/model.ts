import { JoinRatesData } from '../joinRates/model'
import { Dataset as ProfilerData } from '../profiler/model'
import { QualityData } from '../quality'
import { Node as Node0, Edge } from 'react-flow-renderer'
import { RawMetricsDataItemData } from '../metrics/model'

export interface DataPayload {
  label: string
  partitions: number
  violations: number
  columns: Column[]
  style?: {
    color: string
  }
}

// Same as React-flow Node, but the data is required
export interface DataNode<T> extends Node0<T> {
  data: T
}

export type Node = DataNode<DataPayload>
export { Edge }

export interface Graph {
  nodes: Node[]
  edges: Edge[]
  release: string // We determine old/new graph state based on this field
}

export type Highlight = 'nearest' | 'parents' | 'children' | 'none' | 'diffing'

export type Badge = 'violations' | 'partitions'

export interface DataGraph {
  id: string
  name: string
  version: string
  tables: Table[]
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
  metrics?: RawMetricsDataItemData[]
  metadata?: {
    [key: string]: string | number
  }
  style?: { color: string }
}

export interface Column {
  id: string
  name: string
  dependencies?: Array<string>
  style?: { color?: string }
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
