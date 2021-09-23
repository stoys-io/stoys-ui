import { SetStateAction, Dispatch } from 'react'
import { SelectValue } from 'antd/lib/select'

import { JoinRatesData } from '../joinRates/model'
import { Dataset as ProfilerData } from '../profiler/model'
import { QualityData } from '../quality/model'

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

export type Badge = 'violations' | 'partitions'

export type Highlight = 'nearest' | 'parents' | 'children'

export interface GraphProps {
  data?: Graph | Array<Graph>
  nodes?: Nodes
  edges?: Edges
  combos?: Combos
  config?: {
    current?: string
  }
}

export interface Column {
  id: string
  name: string
}

export interface Table {
  id: string
  name: string
  columns: Array<Column>
  measures: {
    rows: number
    violations?: number
  }
  dependencies?: Array<string>
  dp_result?: ProfilerData
  dq_result?: QualityData
  dq_join_results?: Array<JoinRatesData>
  metrics?: any
  metadata?: {
    [key: string]: string | number
  }
}

export interface Graph {
  id: string
  name: string
  version: string
  tables: Array<Table>
}

export interface SidebarProps {
  drawerHeight: number
  badge: Badge
  changeBadge: Dispatch<SetStateAction<Badge>>
  searchInputValue: string
  setSearchInputValue: Dispatch<SetStateAction<string>>
  onSearchNode: () => void
  searchHasError: boolean
  highlight: Highlight
  setHighlight: Dispatch<SetStateAction<Highlight>>
  releases?: Array<string>
  onReleaseChange: (value: SelectValue) => void
}
