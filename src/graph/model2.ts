import { Node as N, Edge } from 'react-flow-renderer'

export interface DataPayload {
  highlight: boolean
  controls?: any
  expand?: boolean
}

export type Node = N<DataPayload>
export { Edge }

export interface Graph {
  nodes: Node[]
  edges: Edge[]
}

export type Highlight = 'nearest' | 'parents' | 'children'
