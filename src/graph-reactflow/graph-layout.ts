import { Edge, isNode, Node, Position } from 'react-flow-renderer'
import dagre from 'dagre'
import { NODE_HEIGHT, NODE_WIDTH } from '../graph-common/constants'
import { Orientation } from '../graph-common/model'

const nodeWidth = NODE_WIDTH
const nodeHeight = NODE_HEIGHT
const ranksep = 64
const nodesep = 16
const startX = 48
const startY = 32

export const graphLayout = (elements: Array<Node | Edge>, orientation: Orientation) => {
  const dagreGraph = new dagre.graphlib.Graph({ compound: true, directed: true, multigraph: false })
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

      // @ts-ignore // TODO: Fix interfaces
      if (el.groupId && el.rootId === undefined) {
        /*
         * Create fake root group element, because we are not allowed to set edges on group elements
         * related issues:
         * - https://github.com/dagrejs/dagre-d3/issues/319
         * - https://github.com/dagrejs/dagre/issues/236
         */
        dagreGraph.setNode(`${el.id}-fake-root`, {
          label: `${el.id}-fake-root`,
        })
      }

      // @ts-ignore // TODO: Fix interfaces
      if (el.rootId) {
        // @ts-ignore
        dagreGraph.setParent(el.id, `${el.id}-fake-root`)
      }
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
