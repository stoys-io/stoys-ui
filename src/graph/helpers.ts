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
    const scale = d3ScaleChromatic[chromaticScale || 'interpolatePuOr'] as any
    return scale(t)
  }

  let nodesWithColors: { id: string, color: string }[] = []
  let edgesWithColors: { id: string, color: string }[] = []

  if (selectedNodeId && highlight === 'nearest') {
    edges.forEach(edge => {
      if (edge.source === selectedNodeId && !nodesWithColors.find(n => n.id === edge.target)) {
      nodesWithColors = [...nodesWithColors, { id: edge.target, color: getScaleChromaticColor(0.25)}]
      edgesWithColors = [ ...edgesWithColors, { id: edge.id, color: getScaleChromaticColor(0.25)}]
      }
      if (edge.target === selectedNodeId && !nodesWithColors.find(n => n.id === edge.source)) {
      nodesWithColors = [...nodesWithColors, { id: edge.source, color: getScaleChromaticColor(0.75)}]
      edgesWithColors = [ ...edgesWithColors, { id: edge.id, color: getScaleChromaticColor(0.75)}]
      }
    })
  }

  if (selectedNodeId && (highlight === 'parents' || highlight === 'children')) {
    const getDepthGradientParams = (maxDepth: number) => {
      let lowParam = 0
      let highParam = 0.25
      if ( highlight === 'parents') {
        lowParam = 0.75
        highParam = 1
      }
      let remainDiff = highParam - lowParam
      const depthGradientParams: { [key: number]: number } = {}
      for (let i = 1; i < maxDepth; i++) {
        if (i === 1) {
          depthGradientParams[i] = highlight === 'parents' ? lowParam : highParam
        } else {
          depthGradientParams[i] = highlight === 'parents' ? (depthGradientParams[i - 1] + remainDiff / 2) : (depthGradientParams[i - 1] - remainDiff / 2)
          remainDiff = remainDiff / 2
        }
      }
      depthGradientParams[maxDepth] = highlight === 'parents' ? highParam : lowParam
      return depthGradientParams
    }

    let nodesWithDepth: { id: string, depth: number }[] = []
    let edgesWithDepth: { id: string, depth: number }[] = []
    let maxDepth = 0

    if (highlight === 'parents') {
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
    }

    if (highlight === 'children') {
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
    }

    const depthGradientParams = getDepthGradientParams(maxDepth)
    nodesWithColors = [
      ...nodesWithColors,
      ...nodesWithDepth.map(node => {
        return {
          id: node.id,
          color: getScaleChromaticColor(depthGradientParams[node.depth])
        }
      })
    ]
    edgesWithColors = [
      ...edgesWithColors,
      ...edgesWithDepth.map(edge => {
        return {
          id: edge.id,
          color: getScaleChromaticColor(depthGradientParams[edge.depth])
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
