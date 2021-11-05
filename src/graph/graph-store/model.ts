import { Graph, DataGraph, Badge, Highlight, Table } from '../model'

export interface GraphStore {
  dispatch: (fn: DispatchHandler) => void

  data: DataGraph[]
  tables?: Table[]
  defaultGraph: Graph // "Current release" graph, stays constant
  graph: Graph // The graph we display, can be merged graph in release mode

  highlights: StoredHighlights
  highlightedColumns: HColumns

  baseRelease: string
  badge: Badge
  highlightMode: Highlight

  selectedNodeId?: string
  searchNodeLabels: (value: string) => string[]

  drawerNodeId?: string
  drawerTab?: string
}

export interface InitialArgs {
  graph: Graph
  data: DataGraph[]
  tables?: Table[]
}

export interface StoredHighlights {
  nodes: StoredNodeStyle
  edges: StoredEdgeStyle
}

export type DispatchHandler = DispatchFn | Partial<GraphStore>
type DispatchFn = (state: GraphStore) => Partial<GraphStore>

interface HColumns {
  selectedTableId: string
  selectedColumnId: string
  relatedColumnsIds: Array<string>
  relatedTablesIds: Array<string>
}

interface StoredNodeStyle {
  [key: string]: { color: string } | undefined
}

interface StoredEdgeStyle {
  [key: string]: EdgeStyle | undefined
}

interface EdgeStyle {
  stroke: string
  strokeWidth: string
}
