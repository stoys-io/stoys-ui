import { Graph, DataGraph, Highlight, Table, TableMetric, ColumnMetric } from '../model'

export interface GraphStore {
  dispatch: (fn: DispatchHandler) => void

  data: DataGraph[]
  tables?: Table[]
  defaultGraph: Graph // "Current release" graph, stays constant
  graph: Graph // The graph we display, can be merged graph in release mode

  highlights: Highlights
  highlightedColumns: HColumns

  baseRelease: string
  tableMetric: TableMetric
  columnMetric: ColumnMetric
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

export type DispatchHandler = DispatchFn | Partial<GraphStore>
type DispatchFn = (state: GraphStore) => Partial<GraphStore>

interface HColumns {
  selectedTableId: string
  selectedColumnId: string
  relatedColumnsIds: Array<string>
  relatedTablesIds: Array<string>
}

interface Highlights {
  nodes: NodeStyle
  edges: EdgeStyle
}

interface NodeStyle {
  [key: string]: { color: string } | undefined
}

interface EdgeStyle {
  [key: string]: EdgeStyleProps | undefined
}

interface EdgeStyleProps {
  stroke: string
  strokeWidth: string
}
