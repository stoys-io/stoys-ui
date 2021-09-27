import { JoinRatesData } from '../joinRates/model'
import { Dataset as ProfilerData } from '../profiler/model'
import { QualityData } from '../quality'

export interface Node {
  id: string
  label: string
  columns?: Array<Column>
  comboId?: string
  violations?: number
  partitions?: number
}

export type Nodes = Array<Node>

export interface Edge {
  id: string
  source: string
  target: string
}

export type Edges = Array<Edge>

export interface Combo {
  id: string
  label: string
}

export type Combos = Array<Combo>

export type Highlight = 'nearest' | 'parents' | 'children'

// export interface GraphProps {
//   data?: Graph
//   nodes?: Nodes
//   edges?: Edges
//   combos?: Combos
//   // You can use any color scheme from https://github.com/d3/d3-scale-chromatic#sequential-single-hue
//   // Pass the name of the scheme as chromaticScale prop (ex. 'interpolateBlues', 'interpolateGreens', etc.)
//   chromaticScale?: ChromaticScale
// }

export interface Column {
  id: string
  name: string
}

// export interface Graph {
//   id: string
//   name: string
//   version: string
//   tables: Array<Table>
// }
