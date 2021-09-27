import { Node as Node0, Edge } from 'react-flow-renderer'

export interface DataPayload {
  label: string
  badge: Badge
  partitions: number
  violations: number
  highlight: boolean
  columns: string[]
  controls?: any
  expand?: boolean
}

export type Node = Node0<DataPayload>
export { Edge }

export interface Graph {
  nodes: Node[]
  edges: Edge[]
}

export type Highlight = 'nearest' | 'parents' | 'children'

export type Badge = 'violations' | 'partitions'
