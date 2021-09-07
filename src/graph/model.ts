export interface Node {
  id: string
  label: string
  comboId?: string
  violations: number
  partitions: number
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
