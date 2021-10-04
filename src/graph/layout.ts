import { Edge, isNode, Node, Position } from 'react-flow-renderer'
import dagre from 'dagre'
import { NODE_HEIGHT, NODE_WIDTH } from './constants'

const nodeWidth = NODE_WIDTH
const nodeHeight = NODE_HEIGHT
const ranksep = 60
const nodesep = 16
const startX = 48
const startY = 32

export const getLayoutedElements = (elements: Array<Node | Edge>, direction: 'LR' | 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))

  const isHorizontal = direction === 'LR'
  dagreGraph.setGraph({
    rankdir: direction,
    align: 'DL',
    ranksep,
    nodesep,
  })

  elements.forEach(el => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
    } else {
      dagreGraph.setEdge(el.source, el.target)
    }
  })

  dagre.layout(dagreGraph)

  return elements.map(el => {
    if (!isNode(el)) {
      return el
    }

    const nodeWithPosition = dagreGraph.node(el.id)
    el.sourcePosition = (isHorizontal ? 'left' : 'top') as Position
    el.targetPosition = (isHorizontal ? 'right' : 'bottom') as Position

    el.position = {
      x: nodeWithPosition.x - nodeWidth / 2 + startX,
      y: nodeWithPosition.y - nodeHeight / 2 + startY,
    }

    return el
  })
}
