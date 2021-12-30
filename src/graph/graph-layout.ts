import dagre from 'dagre'
import { NODE_HEIGHT, NODE_WIDTH } from '../graph-common/constants'
import { Edge, Node } from '../graph-common/model'
import { isNode } from './isNode'

const nodeWidth = NODE_WIDTH
const nodeHeight = NODE_HEIGHT
const ranksep = 64
const nodesep = 16
const startX = 48
const startY = 32

export const graphLayout = (elements: Array<Node | Edge>) => {
  const dagreGraph = new dagre.graphlib.Graph({ compound: true, directed: true, multigraph: false })
  dagreGraph.setDefaultEdgeLabel(() => ({}))

  dagreGraph.setGraph({
    rankdir: 'RL',
    align: 'DL',
    ranksep,
    nodesep,
    ranker: 'longest-path',
  })

  elements.forEach(el => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
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

      if (el.rootId) {
        // @ts-ignore
        dagreGraph.setParent(el.id, `${el.id}-fake-root`)
      }
    } else {
      dagreGraph.setEdge(el.source, el.target)
    }
  })

  const t0 = performance.now()
  dagre.layout(dagreGraph)
  const t1 = performance.now()

  const els = elements.map(el => {
    if (!isNode(el)) {
      return el
    }

    const nodeWithPosition = dagreGraph.node(el.id)
    el.position = {
      x: nodeWithPosition.x - nodeWidth / 2 + startX,
      y: nodeWithPosition.y - nodeHeight / 2 + startY,
    }

    return el
  })

  const time = (t1 - t0).toFixed(2)
  console.log(`Layout calculation took ${time} milliseconds.`)
  return els
}
