import dagre from 'dagre'
import { GraphData, NodeGroups, Position } from './types'

const ranksep = 64
const nodesep = 16
const startX = 48
const startY = 32

export const graphLayout = (
  graph: GraphData,
  nodeWidth: number,
  nodeHeight: number,
  groups: NodeGroups
): GraphDataExtended => {
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
    const idLabel = groupNodeIdLabel(group)
    dagreGraph.setNode(idLabel, {
      label: idLabel,
    })

    const tableListNodeId = rootNodeIdLabel(group)
    dagreGraph.setParent(tableListNodeId, idLabel)
    return dagreGraph.setNode(tableListNodeId, { width: nodeWidth, height: nodeHeight })
  })

  graph.nodes.forEach(node => {
    if (node.groupId && groups[node.groupId]) {
      dagreGraph.setParent(node.id, groupNodeIdLabel(node.groupId))
      return dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
    }

    return dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })

  graph.edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  const t0 = performance.now()
  dagre.layout(dagreGraph)
  const t1 = performance.now()
  console.info(`Layout calculation took ${(t1 - t0).toFixed(2)} milliseconds.`)

  const groupNodes = groupList.map(group => {
    const idLabel = groupNodeIdLabel(group)
    const groupNode = dagreGraph.node(idLabel)
    console.log(groupNode)

    return {
      id: idLabel,
      group: group,
      position: {
        x: groupNode.x - groupNode.width / 2 + startX,
        y: groupNode.y - groupNode.height / 2 + startY,
      },
      width: groupNode.width,
      height: groupNode.height,
    }
  })

  const rootNodes = groupList
    .filter(g => !groups[g])
    .map(group => {
      const rootNodeId = rootNodeIdLabel(group)
      const rootNode = dagreGraph.node(rootNodeId)

      // const idLabel = groupNodeIdLabel(group)
      // const groupNode = dagreGraph.node(idLabel)

      return {
        id: rootNodeId,
        group,
        position: {
          x: rootNode.x - rootNode.width / 2 + startX,
          y: rootNode.y - rootNode.height / 2 + startY,
        },
        width: rootNode.width,
        height: rootNode.height,
      }
    })

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

  return { graph: { ...graph, nodes: newNodes }, groupNodes, rootNodes }
}

const rootNodeIdLabel = (groupId: string) => `table-list-${groupId}`
const groupNodeIdLabel = (groupId: string) => `group-${groupId}`

interface GraphDataExtended {
  graph: GraphData
  groupNodes: GroupNodeData[]
  rootNodes: RootNodeData[]
}

interface RootNodeData {
  id: string
  group: string
  position: Position
  width: number
  height: number
}

interface GroupNodeData {
  id: string
  group: string
  position: Position
  width: number
  height: number
}
