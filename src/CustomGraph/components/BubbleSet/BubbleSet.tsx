import React from 'react'
import { BubbleSet as BS, ShapeSimplifier, BSplineShapeGenerator, PointPath } from './bubblesets-js'
import {
  red,
  volcano,
  gold,
  yellow,
  lime,
  green,
  cyan,
  blue,
  geekblue,
  purple,
  magenta,
  grey,
} from '@ant-design/colors'

const BubbleSet = ({ bubbleSetList }: Props) => {
  const paths = bubbleSetList.map(getBubbleSetPath)

  return paths.length !== 0 ? (
    <g>
      {paths.map((dPath, idx) => (
        <path key={idx} d={dPath} opacity={0.3} fill={colors[idx]} stroke="black" />
      ))}
    </g>
  ) : null
}

export default BubbleSet
export interface Props {
  bubbleSetList: BubbleSetItem[]
}

interface BubbleSetItem {
  nodes: BubblesetNode[]
  otherNodes: BubblesetNode[]
}

interface BubblesetNode {
  x: number
  y: number
  width: number
  height: number
}

const getBubbleSetPath = (bubbleSetItem: BubbleSetItem): string => {
  const bubbles = new BS()
  const list = bubbles.createOutline(
    BS.addPadding(bubbleSetItem.nodes, pad),
    BS.addPadding(bubbleSetItem.otherNodes, 1),
    null /* lines */
  )

  const outline = new PointPath(list).transform([
    new ShapeSimplifier(1.0),
    new BSplineShapeGenerator(),
    new ShapeSimplifier(1.0),
  ]) as unknown as string

  return outline
}

const pad = 3

const colors = [
  red,
  blue,
  green,
  yellow,
  volcano,
  geekblue,
  lime,
  gold,
  grey,
  magenta,
  cyan,
  purple,
].map(c => c.primary)
