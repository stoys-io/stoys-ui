import { BubbleSet, ShapeSimplifier, BSplineShapeGenerator, PointPath } from './bubblesets-js'

export const getBubbleSetPath = (nodes: BubblesetNode[], otherNodes: BubblesetNode[]): string => {
  const bubbles = new BubbleSet()
  const list = bubbles.createOutline(
    BubbleSet.addPadding(nodes, pad),
    BubbleSet.addPadding(otherNodes, 1),
    null /* lines */
  )

  const outline = new PointPath(list).transform([
    new ShapeSimplifier(1.0),
    new BSplineShapeGenerator(),
    new ShapeSimplifier(1.0),
  ]) as unknown as string

  return outline
}

interface BubblesetNode {
  x: number
  y: number
  width: number
  height: number
}

const pad = 3
