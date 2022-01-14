import { NODE_HEIGHT } from '../graph-common/constants'
import { EdgeData, GroupIndex, NodeGroups, NodeIndex, Position } from './types'

export const edgePosition = (
  edge: EdgeData,
  nodeIndex: NodeIndex,
  groups: NodeGroups,
  groupIndex: GroupIndex,
  groupPosition: (groupId: string) => Position
): EdgePosition => {
  const {
    position: { x: x1, y: y1 },
    groupId: sourceGroupId,
  } = nodeIndex[edge.source]
  const {
    position: { x: x2, y: y2 },
    groupId: targetGroupId,
  } = nodeIndex[edge.target]

  // Group edges:
  const isEdgeOutbound = sourceGroupId !== targetGroupId
  const isTargetGroupOpen = targetGroupId && groups[targetGroupId]
  const isSourceGroupOpen = sourceGroupId && groups[sourceGroupId]

  const isRegularEdge = !sourceGroupId && !targetGroupId
  const isGroupOpenInboundEdge = !isEdgeOutbound && (isTargetGroupOpen || isSourceGroupOpen)

  const isGroupClosedInboundEdge = !isEdgeOutbound && (!isTargetGroupOpen || !isSourceGroupOpen)

  if (isRegularEdge || isGroupOpenInboundEdge) {
    return { position: [x2, y2, x1, y1], isHidden: false }
  }

  if (isGroupClosedInboundEdge) {
    // Inbound edge closed group
    const { x: xRoot, y: yRoot } = sourceGroupId
      ? groupPosition(sourceGroupId)
      : groupPosition(targetGroupId!)

    const position: Pos = sourceGroupId ? [x2, y2, xRoot, yRoot] : [xRoot, yRoot, x1, y1]

    return { position, isHidden: true }
  }

  // TODO: This could have been simpler
  // Outbound edge:
  const thisGroupId = sourceGroupId ? sourceGroupId : targetGroupId
  const otherGroupId = sourceGroupId ? targetGroupId : sourceGroupId

  const thisTable = sourceGroupId ? edge.source : edge.target
  const otherTable = sourceGroupId ? edge.target : edge.target

  const { x: xThisRoot, y: yThisRoot } = groupPosition(thisGroupId!)
  const thisHandleIndex = groupIndex[thisGroupId!].indexOf(thisTable)

  const xThisHandle = xThisRoot
  const yThisHandle = shiftYHandle(yThisRoot, thisHandleIndex)

  const thisGroupOpen = sourceGroupId ? isSourceGroupOpen : isTargetGroupOpen
  const otherNodeVisible = sourceGroupId
    ? targetGroupId === undefined || isTargetGroupOpen
    : sourceGroupId === undefined || isSourceGroupOpen

  const outboundCase1 = !thisGroupOpen && otherNodeVisible
  const outboundCase2 = !thisGroupOpen && !otherNodeVisible
  const outboundCase3 = thisGroupOpen && otherNodeVisible
  const outboundCase4 = thisGroupOpen && !otherNodeVisible

  let position: Pos = [0, 0, 0, 0]
  if (outboundCase1) {
    position = sourceGroupId
      ? [x2, y2, xThisHandle, yThisHandle]
      : [xThisHandle, yThisHandle, x1, y1]

    // TODO: Re-write
    // Table list corner cases:
    if (thisGroupId === targetGroupId) {
      const otherHandleIndex = groupIndex[otherGroupId!].indexOf(otherTable)
      const x_handle = xThisRoot
      const y_handle = shiftYHandle(yThisRoot, otherHandleIndex)
      position = [x_handle, y_handle, x1, y1]
    }
  }

  if (outboundCase2) {
    const { x: xOtherRoot, y: yOtherRoot } = groupPosition(otherGroupId!)
    const otherHandleIndex = groupIndex[otherGroupId!].indexOf(otherTable)
    const xOtherHandle = xOtherRoot
    const yOtherHandle = shiftYHandle(yOtherRoot, otherHandleIndex)

    position = sourceGroupId
      ? [xOtherHandle, yOtherHandle, xThisHandle, yThisHandle]
      : [xThisHandle, yThisHandle, xOtherHandle, yOtherHandle]

    // TODO: Re-write
    // Table list corner cases:
    if (thisGroupId === targetGroupId) {
      const x_handle2 = xThisRoot
      const y_handle2 = shiftYHandle(yThisRoot, otherHandleIndex)

      const x_handle1 = xOtherRoot
      const y_handle1 = shiftYHandle(yOtherRoot, thisHandleIndex)

      position = [x_handle2, y_handle2, x_handle1, y_handle1]
    }
  }

  if (outboundCase3) {
    position = [x2, y2, x1, y1]
  }

  if (outboundCase4) {
    const { x: xOtherRoot, y: yOtherRoot } = groupPosition(otherGroupId!)
    const otherHandleIndex = groupIndex[otherGroupId!].indexOf(otherTable)

    const xOtherHandle = xOtherRoot
    const yOtherHandle = shiftYHandle(yOtherRoot, otherHandleIndex)

    position = sourceGroupId
      ? [xOtherHandle, yOtherHandle, x1, y1]
      : [x2, y2, xOtherHandle, yOtherHandle]

    // TODO: Re-write
    // Table list corner cases:
    if (thisGroupId === targetGroupId) {
      const x_handle = xOtherRoot
      const y_handle = shiftYHandle(yOtherRoot, thisHandleIndex)

      position = [x2, y2, x_handle, y_handle]
    }
  }

  return { position, isHidden: false }
}

interface EdgePosition {
  position: Pos
  isHidden: boolean
}

type Pos = [x1: number, y1: number, x2: number, y2: number]

// TODO: Remove hardcoded positions
const step = 23
const something = 5
const headerSpace = 36 + something
const shiftYHandle = (y: number, index: number) =>
  y - NODE_HEIGHT / 2 + headerSpace + step * (index + 0.5)
