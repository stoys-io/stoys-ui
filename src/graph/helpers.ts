import { Nodes, Edges, Combos, Badge, Highlight } from './model'

type GetGraphDataArgsType = {
  data: {
    nodes: Nodes,
    edges: Edges,
    combos?: Combos
  },
  selectedNodeId: string,
  badge: Badge
  highlight: Highlight
}

export const getGraphData = ({ data, selectedNodeId, badge, highlight } : GetGraphDataArgsType) => {
  const { nodes, edges, combos } = data
  let highLightedNodesIds = selectedNodeId ? [selectedNodeId] : []
  let highLightedEdgesIds: string[] = []

  if (highlight === 'nearest') {
    highLightedEdgesIds = edges
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
  }

  if (highlight === 'parents') {
    const findSources = (nodeId: string) => {
      edges.forEach(edge => {
        if (nodeId === edge.target) {
          if (!highLightedEdgesIds.includes(edge.id)) {
            highLightedEdgesIds = [...highLightedEdgesIds, edge.id]
          }
          if (!highLightedNodesIds.includes(edge.source)) {
            highLightedNodesIds = [...highLightedNodesIds, edge.source]
          }
          findSources(edge.source)
        }
      })
    }
    findSources(selectedNodeId)
  }

  if (highlight === 'children') {
    const findTargets = (nodeId: string) => {
      edges.forEach(edge => {
        if (nodeId === edge.source) {
          if (!highLightedEdgesIds.includes(edge.id)) {
            highLightedEdgesIds = [...highLightedEdgesIds, edge.id]
          }
          if (!highLightedNodesIds.includes(edge.target)) {
            highLightedNodesIds = [...highLightedNodesIds, edge.target]
            findTargets(edge.target)
          }
        }
      })
    }
    findTargets(selectedNodeId)
  }

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

export const trimText = (label: string) => {
  if (label.length > 24) {
    return `${label.slice(0, 22)}...`
  }
  return label
}
