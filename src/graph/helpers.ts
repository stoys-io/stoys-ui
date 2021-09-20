import * as d3ScaleChromatic from 'd3-scale-chromatic'
import { Nodes, Edges, Combos, Badge, Highlight, ChromaticScale } from './model'

type GetGraphDataArgsType = {
  data: {
    nodes: Nodes,
    edges: Edges,
    combos?: Combos
  },
  selectedNodeId: string,
  badge: Badge
  highlight: Highlight
  chromaticScale?: ChromaticScale
}

export const getGraphData = ({ data, selectedNodeId, badge, highlight, chromaticScale } : GetGraphDataArgsType) => {
  const { nodes, edges, combos } = data

  const getScaleChromaticColor = (t: number) => {
    const scale = d3ScaleChromatic[chromaticScale || 'interpolateWarm'] as any
    return scale(t)
  }

  let nodesWithColors = [
    { id: selectedNodeId, color: getScaleChromaticColor(0.5)}
  ]
  let edgesWithColors: { id: string, color: string }[] = []

  if (highlight === 'nearest') {
    edges.forEach(edge => {
      if (edge.source === selectedNodeId && !nodesWithColors.find(n => n.id === edge.target)) {
      nodesWithColors = [...nodesWithColors, { id: edge.target, color: getScaleChromaticColor(1)}]
      edgesWithColors = [ ...edgesWithColors, { id: edge.id, color: getScaleChromaticColor(1)}]
      }
      if (edge.target === selectedNodeId && !nodesWithColors.find(n => n.id === edge.source)) {
      nodesWithColors = [...nodesWithColors, { id: edge.source, color: getScaleChromaticColor(0)}]
      edgesWithColors = [ ...edgesWithColors, { id: edge.id, color: getScaleChromaticColor(0)}]
      }
    })
  }

  if (highlight === 'parents') {
    let nodesWithDepth: { id: string, depth: number }[] = []
    let edgesWithDepth: { id: string, depth: number }[] = []
    let maxDepth = 0
    const findSources = (nodeId: string, depth: number) => {
      edges.forEach(edge => {
        if (nodeId === edge.target) {
          if (!nodesWithDepth.find(n => (n.id === edge.source) || (n.id === selectedNodeId))) {
            nodesWithDepth = [...nodesWithDepth, { id: edge.source, depth }]
            edgesWithDepth = [ ...edgesWithDepth, { id: edge.id, depth }]
            maxDepth = maxDepth > depth ? maxDepth : depth
            findSources(edge.source, depth + 1)
          }
        }
      })
    }
    findSources(selectedNodeId, 1)

    const colorSchemaStep = 0.5/maxDepth
    nodesWithColors = [
      ...nodesWithColors,
      ...nodesWithDepth.map(node => {
        return {
          id: node.id,
          color: getScaleChromaticColor(0.5 - node.depth * colorSchemaStep)
        }
      })
    ]
    edgesWithColors = [
      ...edgesWithColors,
      ...edgesWithDepth.map(edge => {
        return {
          id: edge.id,
          color: getScaleChromaticColor(0.5 - edge.depth * colorSchemaStep)
        }
      })
    ]
  }

  if (highlight === 'children') {
    let nodesWithDepth: { id: string, depth: number }[] = []
    let edgesWithDepth: { id: string, depth: number }[] = []
    let maxDepth = 0
    const findTargets = (nodeId: string, depth: number) => {
      edges.forEach(edge => {
        if (nodeId === edge.source) {
          if (!nodesWithDepth.find(n => (n.id === edge.target) || (n.id === selectedNodeId))) {
            nodesWithDepth = [...nodesWithDepth, { id: edge.target, depth }]
            edgesWithDepth = [ ...edgesWithDepth, { id: edge.id, depth }]
            maxDepth = maxDepth > depth ? maxDepth : depth
            findTargets(edge.target, depth + 1)
          }
        }
      })
    }
    findTargets(selectedNodeId, 1)

    const colorSchemaStep = 0.5/maxDepth
    nodesWithColors = [
      ...nodesWithColors,
      ...nodesWithDepth.map(node => {
        return {
          id: node.id,
          color: getScaleChromaticColor(0.5 + node.depth * colorSchemaStep)
        }
      })
    ]
    edgesWithColors = [
      ...edgesWithColors,
      ...edgesWithDepth.map(edge => {
        return {
          id: edge.id,
          color: getScaleChromaticColor(0.5 + edge.depth * colorSchemaStep)
        }
      })
    ]
  }

  const getNodeColor = (nodeId: string) => {
    const highlightedNode = nodesWithColors.find(n => n.id === nodeId)
    return highlightedNode ? highlightedNode.color : null
  }

  const getEdgeColor = (edgeId: string) => {
    const highlightedEdge = edgesWithColors.find(edge => edge.id === edgeId)
    return highlightedEdge ? highlightedEdge.color : null
  }

  return {
    nodes: nodes.map((node) => ({
      ...node,
      highlightingColor: getNodeColor(node.id),
      selected: node.id === selectedNodeId,
      badgeNumber: node[badge],
    })),
    edges: edges.map(edge => ({
      ...edge,
      style: {
        stroke: getEdgeColor(edge.id) || '#ccc',
        lineWidth: getEdgeColor(edge.id) ? 3 : 2,
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
