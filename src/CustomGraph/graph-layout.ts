import dagre from 'dagre'
import { GraphData, NodeGroups, Position, NodeData, EdgeData } from './types'

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

    // closed group root node
    if (!groups[group]) {
      const tableListNodeId = rootNodeIdLabel(group)
      dagreGraph.setParent(tableListNodeId, idLabel)
      return dagreGraph.setNode(tableListNodeId, { width: nodeWidth, height: nodeHeight })
    }
  })

  graph.nodes.forEach(node => {
    // Regular node
    if (!node.groupId) {
      return dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
    }

    // opened group node
    if (groups[node.groupId]) {
      dagreGraph.setParent(node.id, groupNodeIdLabel(node.groupId))
      return dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
    }
  })

  graph.edges.forEach(edge => {
    const sourceNode = dagreGraph.node(edge.source)
    const targetNode = dagreGraph.node(edge.target)
    if (!sourceNode && !targetNode) {
      return
    }

    return dagreGraph.setEdge(edge.source, edge.target)
  })

  const t0 = performance.now()
  dagre.layout(dagreGraph)
  const t1 = performance.now()
  console.info(`Layout calculation took ${(t1 - t0).toFixed(2)} milliseconds.`)

  const groupNodes = groupList.map(group => {
    const idLabel = groupNodeIdLabel(group)
    const groupNode = dagreGraph.node(idLabel)

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

  const newNodes = graph.nodes.reduce((acc, node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    if (nodeWithPosition) {
      const newNode = {
        ...node,
        position: {
          x: nodeWithPosition.x - nodeWidth / 2 + startX,
          y: nodeWithPosition.y - nodeHeight / 2 + startY,
        },
      }

      return [...acc, newNode]
    }

    return acc
  }, [] as NodeData[])

  const newEdges = graph.edges.reduce((acc, edge) => {
    const sourceNode = dagreGraph.node(edge.source)
    const targetNode = dagreGraph.node(edge.target)
    if (sourceNode && targetNode) {
      return [...acc, edge]
    }

    return acc
  }, [] as EdgeData[])

  return {
    graph: {
      ...graph,
      nodes: newNodes,
      edges: newEdges,
    },
    groupNodes,
    rootNodes,
  }
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
