import { JoinRatesData } from '../joinRates/model'
import { Dataset as ProfilerData } from '../profiler/model'
import { QualityData } from '../quality'
import { Node as Node0, Edge } from 'react-flow-renderer'

export interface DataPayload {
  label: string
  badge: Badge
  partitions: number
  violations: number
  highlight: boolean
  columns: Column[]
  onTitleClick: (id: string) => void
  onListItemClick: (columnId: string, tableId: string) => void
  highlightedColumns?: {
    selectedTableId: string
    selectedColumnId: string
    reletedColumnsIds: Array<string>
    reletedTablesIds: Array<string>
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
}

export type Highlight = 'nearest' | 'parents' | 'children'

export type Badge = 'violations' | 'partitions'

export interface Table {
  id: string
  name: string
  columns: Column[]
  measures: {
    rows: number
    violations?: number
  }
  dependencies?: string[]
  dp_result?: ProfilerData
  dq_result?: QualityData
  dq_join_results?: JoinRatesData[]
  metrics?: any // TODO: use proper type
  metadata?: {
    [key: string]: string | number
  }
}

export interface Column {
  id: string
  name: string
  dependencies?: Array<string>
}

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
