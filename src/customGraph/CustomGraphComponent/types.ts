export interface NodeProps<T = any> {
  id: string
  position: Position
  data?: T
  groupId?: string
  rootId?: string
}

interface Position {
  x: number
  y: number
}
