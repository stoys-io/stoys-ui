import { isNode, Position } from 'react-flow-renderer'
import dagre from 'dagre'

const dagreGraph = new dagre.graphlib.Graph()

dagreGraph.setDefaultEdgeLabel(() => ({}))
const nodeWidth = 172
const nodeHeight = 36

export const getLayoutedElements = (elements: any, direction = 'TB') => {
  const isHorizontal = direction === 'LR'
  dagreGraph.setGraph({ rankdir: direction })

  elements.forEach((el: any) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight })
    } else {
      dagreGraph.setEdge(el.source, el.target)
    }
  })

  dagre.layout(dagreGraph)

  return elements.map((el: any) => {
    if (isNode(el)) {
      const nodeWithPosition = dagreGraph.node(el.id)
      el.targetPosition = (isHorizontal ? 'left' : 'top') as Position
      el.sourcePosition = (isHorizontal ? 'right' : 'bottom') as Position

      el.position = {
        x: nodeWithPosition.x - nodeWidth / 2, // + Math.random() / 1000,
        y: nodeWithPosition.y - nodeHeight / 2,
      }
    }

    return el
  })
}
