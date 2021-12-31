export interface GraphData {
  nodes: NodeData[]
  edges: EdgeData[]
}

export interface NodeData<T = any> {
  id: string
  position: Position
  data?: T
  groupId?: string
  rootId?: string
}

export interface EdgeData {
  id: string
  source: string
  target: string
}

interface Position {
  x: number
  y: number
}

export { EdgeProps } from './components'
