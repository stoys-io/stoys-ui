import create from 'zustand'
import { GraphStore, DispatchHandler } from './model'

export const createStore = () =>
  create<GraphStore>((set, get) => ({
    dispatch: (fn: DispatchHandler) => set(fn as any),

    init: false,
    data: [],

    currentReleaseGraph: defaultGraphValue,
    selectedReleaseGraph: defaultGraphValue,
    graph: defaultGraphValue,
    highlightedColumns: defaultHighlightedColumns,

    drawerTab: undefined,
    drawerNodeId: undefined,

    selectedNodeId: undefined,
    searchNodeLabels: (value: string): string[] => {
      const graph = get().graph
      return graph.nodes
        .filter(node => node.data?.label.indexOf(value.toLowerCase()) !== -1)
        .map(node => node.id)
    },

    baseRelease: '',
    tableMetric: 'partitions',
    columnMetric: 'none',
    columnMetricMaxValue: 0,
    countNormalize: false,

    highlightMode: 'nearest',
    highlights: defaultHighlights,
  }))

export const defaultHighlightedColumns = {
  selectedTableId: '',
  selectedColumnId: '',
  relatedColumnsIds: [],
  relatedTablesIds: [],
}

export const defaultHighlights = { nodes: {}, edges: {} }
export const defaultColumnHighlights = {}

const defaultGraphValue = {
  nodes: [],
  edges: [],
  release: '',
}
