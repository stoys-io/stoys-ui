import { Edge, isNode, Node, Position } from 'react-flow-renderer'
import dagre from 'dagre'
import { NODE_HEIGHT, NODE_WIDTH } from './constants'

const dagreGraph = new dagre.graphlib.Graph()

dagreGraph.setDefaultEdgeLabel(() => ({}))
const nodeWidth = NODE_WIDTH
const nodeHeight = NODE_HEIGHT
const startX = 100
const startY = 30

export const getLayoutedElements = (elements: Array<Node | Edge>) => {
  const direction = 'TB'
  const isHorizontal = false // direction === 'LR'
  dagreGraph.setGraph({
    rankdir: direction,
    // acyclicer: 'greedy',
    align: 'UL',
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
    el.targetPosition = (isHorizontal ? 'left' : 'top') as Position
    el.sourcePosition = (isHorizontal ? 'right' : 'bottom') as Position

    el.position = {
      x: nodeWithPosition.x - nodeWidth / 2 + startX,
      y: nodeWithPosition.y - nodeHeight / 2 + startY,
    }

    return el
  })
}
