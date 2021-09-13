import { Nodes, Edges, Combos, Badge } from './model'

type GetGraphDataArgsType = {
  data: {
    nodes: Nodes,
    edges: Edges,
    combos?: Combos
  },
  selectedNodeId: string,
  badge: Badge
}

export const getGraphData = ({ data, selectedNodeId, badge } : GetGraphDataArgsType) => {
  const { nodes, edges, combos } = data
  let highLightedNodesIds = selectedNodeId ? [selectedNodeId] : []
  const highLightedEdgesIds = edges
    .filter(edge => {
      if (edge.source === selectedNodeId && !highLightedNodesIds.includes(edge.target)) {
        highLightedNodesIds = [...highLightedNodesIds, edge.target]
      }
      if (edge.target === selectedNodeId && !highLightedNodesIds.includes(edge.source)) {
        highLightedNodesIds = [...highLightedNodesIds, edge.source]
      }
      return (edge.source === selectedNodeId) || (edge.target === selectedNodeId)
    })
    .map(edge => edge.id)

  return {
    nodes: nodes.map((node) => ({
      ...node,
      highlighted: highLightedNodesIds.includes(node.id),
      selected: node.id === selectedNodeId,
      badgeNumber: node[badge],
    })),
    edges: edges.map(edge => ({
      ...edge,
      style: {
        stroke: highLightedEdgesIds.includes(edge.id) ? '#1e80fe' : '#ccc',
        lineWidth: highLightedEdgesIds.includes(edge.id) ? 3 : 2,
      },
    })),
    combos,
  }
}

export const getLabelText = (label: string) => {
  if (label.length > 24) {
    return `${label.slice(0, 22)}...`
  }
  return label
}
