import { Edge, isNode, Node, Position } from 'react-flow-renderer'
import dagre from 'dagre'
import { NODE_HEIGHT, NODE_WIDTH } from './constants'
import { Orientation } from './model'

const nodeWidth = NODE_WIDTH
const nodeHeight = NODE_HEIGHT
const ranksep = 60
const nodesep = 16
const startX = 48
const startY = 32

export const getLayoutedElements = (elements: Array<Node | Edge>, orientation: Orientation) => {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))

  const direction = orientation === 'horizontal' ? 'RL' : 'BT'
  const isHorizontal = orientation === 'horizontal'
  dagreGraph.setGraph({
    rankdir: direction,
    align: 'DL',
    ranksep,
    nodesep,
    ranker: 'longest-path',
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
