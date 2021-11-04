import create from 'zustand'
import { GraphStore, DispatchHandler } from './model'

export const createStore = () =>
  create<GraphStore>((set, get) => ({
    dispatch: (fn: DispatchHandler) => set(fn as any),

    graph: { nodes: [], edges: [] },

    highlightedColumns: defaultHighlightedColumns,

    data: [],
    tables: undefined,

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
    badge: 'violations',

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