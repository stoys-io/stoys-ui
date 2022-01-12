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
  points?: Position[] // Control points
}

export interface Position {
  x: number
  y: number
}

export interface NodeGroups {
  [key: string]: boolean
}

export { EdgeProps } from './components'

export interface NodeIndex {
  [key: string]: NodeData
}

export interface GroupIndex {
  [key: string]: string[]
}
