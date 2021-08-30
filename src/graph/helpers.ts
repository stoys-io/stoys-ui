import { nodes } from './__mocks__/Nodes.mock'
import { edges } from './__mocks__/Edges.mock'
import { combos } from './__mocks__/Combos.mock'

export const getData = (selectedNodeId?: string) => {
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
  if (label.length > 17) {
    return `${label.slice(0, 15)}...`
  }
  return label
}
