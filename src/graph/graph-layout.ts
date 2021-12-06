import { Edge, isNode, Node, Position } from 'react-flow-renderer'
import dagre from 'dagre'
import { NODE_HEIGHT, NODE_WIDTH } from './constants'
import { Graph, Orientation } from './model'

const nodeWidth = NODE_WIDTH
const nodeHeight = NODE_HEIGHT
const ranksep = 64
const nodesep = 16
const startX = 48
const startY = 32

export const graphLayout = (elements: Array<Node | Edge>, orientation: Orientation): Graph => {
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
      // @ts-ignore
      el.isRoot
        ? dagreGraph.setNode(el.id, { width: 300, height: 300 })
        : dagreGraph.setNode(el.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
    } else {
      dagreGraph.setEdge(el.source, el.target)
    }
  })

  dagre.layout(dagreGraph)

  return {
    // @ts-ignore
    nodes: elements
      .filter(el => isNode(el))
      .map(el => {
        const nodeWithPosition = dagreGraph.node(el.id)
        // @ts-ignore
        el.sourcePosition = (isHorizontal ? 'left' : 'top') as Position
        // @ts-ignore
        el.targetPosition = (isHorizontal ? 'right' : 'bottom') as Position

        // @ts-ignore
        if (el.parentNode) {
          // @ts-ignore
          const parent = elements.find(el2 => el2.id == el.parentNode)
          console.log({ parent })

          // @ts-ignore
          el.position = {
            // @ts-ignore
            // x: nodeWithPosition.x - nodeWidth / 2 + startX - parent.position.x,
            // @ts-ignore
            // y: nodeWithPosition.y - nodeHeight / 2 + startY - parent.position.y,

            // // @ts-ignore
            // x: nodeWithPosition.x - nodeWidth / 2 + startX,
            // // @ts-ignore
            // y: nodeWithPosition.y - nodeHeight / 2 + startY,

            x: 0,
            y: 0,
          }

          return el
        }

        // @ts-ignore
        if (el.isRoot) {
          // @ts-ignore
          el.position = {
            x: nodeWithPosition.x - 300 / 2 + startX,
            y: nodeWithPosition.y - 300 / 2 + startY,
          }

          return el
        }

        // @ts-ignore
        el.position = {
          x: nodeWithPosition.x - nodeWidth / 2 + startX,
          y: nodeWithPosition.y - nodeHeight / 2 + startY,
        }

        return el
      }),
    // @ts-ignore
    edges: elements.filter(el => !isNode(el)),
  }
}
