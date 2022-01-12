import dagre from 'dagre'
import { EdgeData, GraphData, NodeData, NodeGroups } from './types'

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

  graph.nodes.forEach(node => {
    if (node.groupId && groups[node.groupId] && node.rootId === undefined) {
      /*
       * Create fake root group element, because we are not allowed to set edges on group elements
       * related issues:
       * - https://github.com/dagrejs/dagre-d3/issues/319
       * - https://github.com/dagrejs/dagre/issues/236
       */
      dagreGraph.setNode(`${node.id}-fake-root`, {
        label: `${node.id}-fake-root`,
      })
    }

    if (node.groupId && groups[node.groupId] && node.rootId) {
      // @ts-ignore
      dagreGraph.setParent(node.id, `${node.id}-fake-root`)
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

  const newNodes = graph.nodes.map((node: NodeData): NodeData => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      position: {
        x: nodeWithPosition.x + startX,
        y: nodeWithPosition.y + startY,
      },
    }
  })

  const newEdges = graph.edges.map((edge: EdgeData): EdgeData => {
    const { points: p } = dagreGraph.edge(edge.source, edge.target)
    const points = p.map(point => ({
      x: point.x + startX,
      y: point.y + startY,
    }))
    return {
      ...edge,
      points,
    }
  })

  return { ...graph, edges: newEdges, nodes: newNodes }
}
