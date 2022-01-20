import { Graph, DataGraph, Highlight, TableMetric, ColumnMetric, Node } from '../model'

export interface GraphStore {
  dispatch: (fn: DispatchHandler) => void

  init: boolean
  data: DataGraph[]

  // To facilitate access to node data
  currentReleaseNodeNameIndex: ReleaseNodeNameIndex

  // "Current release" graph, stays constant
  currentReleaseGraph: Graph
  // Either "Current release" graph or selected "previous run"
  selectedReleaseGraph: Graph
  // Actual visible graph. It can be a selectedReleaseGraph or a merged graph in diffing mode
  graph: Graph

  highlights: Highlights
  highlightedColumns: HColumns // TODO: rename to selected columns

  baseRelease: string
  tableMetric: TableMetric
  columnMetric: ColumnMetric
  columnMetricMaxValue: number
  countNormalize: boolean

  highlightMode: Highlight

  selectedNodeId?: string
  searchNodeLabels: (value: string) => string[]

  drawerNodeId?: string
  drawerTab?: string
}

export interface InitialArgs {
  graph: Graph
  data: DataGraph[]
}

export type DispatchHandler = DispatchFn | Partial<GraphStore>
type DispatchFn = (state: GraphStore) => Partial<GraphStore>

interface HColumns {
  selectedTableId: string
  selectedColumnId: string
  relatedColumnsIds: Array<string>
}

interface Highlights {
  nodes: NodeStyle
  edges: EdgeStyle
}

export interface ColumnStyle {
  [key: string]: { color: string } | undefined
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

interface ReleaseNodeNameIndex {
  index: NodeNameIndex
  release: string
}

interface NodeNameIndex {
  [nodeName: string]: Node
}
