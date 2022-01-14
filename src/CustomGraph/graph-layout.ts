import dagre from 'dagre'
import { GraphData, NodeGroups } from './types'

const ranksep = 64
const nodesep = 16
const startX = 48
const startY = 32

export const graphLayout = (
  graph: GraphData,
  nodeWidth: number,
  nodeHeight: number,
  groups: NodeGroups
): GraphData => {
  const dagreGraph = new dagre.graphlib.Graph({ compound: true, directed: true, multigraph: false })
  dagreGraph.setDefaultEdgeLabel(() => ({}))

  dagreGraph.setGraph({
    rankdir: 'RL',
    align: 'DL',
    ranksep,
    nodesep,
    ranker: 'longest-path',
  })

  const groupList = Object.keys(groups)
  groupList.forEach(group => {
    dagreGraph.setNode(`group-${group}`, {
      label: `group-${group}`,
    })
  })

  graph.nodes.forEach(node => {
    if (node.groupId && groups[node.groupId]) {
      dagreGraph.setParent(node.id, `group-${node.groupId}`)
    }

    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })

  graph.edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  const t0 = performance.now()
  dagre.layout(dagreGraph)
  const t1 = performance.now()
  console.info(`Layout calculation took ${(t1 - t0).toFixed(2)} milliseconds.`)

  const newNodes = graph.nodes.map(node => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2 + startX,
        y: nodeWithPosition.y - nodeHeight / 2 + startY,
      },
    }
  })

  return { ...graph, nodes: newNodes }
}
