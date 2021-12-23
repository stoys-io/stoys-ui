import { BubbleSet, ShapeSimplifier, BSplineShapeGenerator, PointPath } from '../bubblesets-js'

const bubbles = new BubbleSet()
export const getBubbleSetPath = (nodes: any, otherNodes: any): any => {
  const list = bubbles.createOutline(
    BubbleSet.addPadding(nodes, pad),
    BubbleSet.addPadding(otherNodes, 1),
    null /* lines */
  )

  const outline = new PointPath(list).transform([
    new ShapeSimplifier(1.0),
    new BSplineShapeGenerator(),
    new ShapeSimplifier(1.0),
  ])

  return outline
}

const pad = 3
