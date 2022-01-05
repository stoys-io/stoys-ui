import { NODE_HEIGHT } from '../graph-common/constants'
import { EdgeData, GroupIndex, NodeGroups, NodeIndex } from './types'

export const edgePosition = (
  edge: EdgeData,
  nodeIndex: NodeIndex,
  groups: NodeGroups,
  groupIndex: GroupIndex
): EdgePosition => {
  const {
    position: { x: x1, y: y1 },
    rootId: sourceRootId,
    groupId: sourceGroupId,
  } = nodeIndex[edge.source]
  const {
    position: { x: x2, y: y2 },
    rootId: targetRootId,
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
    const { x: xRoot, y: yRoot } = sourceRootId
      ? nodeIndex[sourceRootId].position
      : nodeIndex[targetRootId!].position

    const position: Pos = sourceRootId ? [x2, y2, xRoot, yRoot] : [xRoot, yRoot, x1, y1]

    return { position, isHidden: true }
  }

  // TODO: This could have been simpler
  // Outbound edge:
  const thisRootId = sourceRootId ? sourceRootId ?? edge.source : targetRootId ?? edge.target
  const otherRootId = sourceRootId ? targetRootId ?? edge.target : sourceRootId ?? edge.source

  const thisGroupId = sourceGroupId ? sourceGroupId : targetGroupId
  const otherGroupId = sourceGroupId ? targetGroupId : sourceGroupId

  const thisTable = sourceGroupId ? edge.source : edge.target
  const otherTable = sourceGroupId ? edge.target : edge.target

  const { x: xThisRoot, y: yThisRoot } = nodeIndex[thisRootId].position

  const step = 23
  const something = 5
  const headerSpace = 36 + something
  const thisHandleIndex = groupIndex[thisGroupId!].indexOf(thisTable)

  const xThisHandle = xThisRoot
  const yThisHandle = yThisRoot - NODE_HEIGHT / 2 + headerSpace + step * (thisHandleIndex + 0.5)

  const thisGroupOpen = sourceRootId ? isSourceGroupOpen : isTargetGroupOpen
  const otherNodeVisible = sourceRootId
    ? targetGroupId === undefined || isTargetGroupOpen
    : sourceGroupId === undefined || isSourceGroupOpen

  const outboundCase1 = !thisGroupOpen && otherNodeVisible
  const outboundCase2 = !thisGroupOpen && !otherNodeVisible
  const outboundCase3 = thisGroupOpen && otherNodeVisible
  const outboundCase4 = thisGroupOpen && !otherNodeVisible

  let position: Pos = [0, 0, 0, 0]
  if (outboundCase1) {
    position = sourceRootId
      ? [x2, y2, xThisHandle, yThisHandle]
      : [xThisHandle, yThisHandle, x1, y1]

    // TODO: Re-write
    // Table list corner cases:
    if (thisRootId === edge.target) {
      const otherHandleIndex = groupIndex[otherGroupId!].indexOf(otherTable)
      const x_handle = xThisRoot
      const y_handle = yThisRoot - NODE_HEIGHT / 2 + headerSpace + step * (otherHandleIndex + 0.5)
      position = [x_handle, y_handle, x1, y1]
    }
  }

  if (outboundCase2) {
    const { x: xOtherRoot, y: yOtherRoot } = nodeIndex[otherRootId!].position
    const otherHandleIndex = groupIndex[otherGroupId!].indexOf(otherTable)
    const xOtherHandle = xOtherRoot
    const yOtherHandle =
      yOtherRoot - NODE_HEIGHT / 2 + headerSpace + step * (otherHandleIndex + 0.5)

    position = sourceRootId
      ? [xOtherHandle, yOtherHandle, xThisHandle, yThisHandle]
      : [xThisHandle, yThisHandle, xOtherHandle, yOtherHandle]

    // TODO: Re-write
    // Table list corner cases:
    if (thisRootId === edge.target) {
      const x_handle2 = xThisRoot
      const y_handle2 = yThisRoot - NODE_HEIGHT / 2 + headerSpace + step * (otherHandleIndex + 0.5)

      const x_handle1 = xOtherRoot
      const y_handle1 = yOtherRoot - NODE_HEIGHT / 2 + headerSpace + step * (thisHandleIndex + 0.5)

      position = [x_handle2, y_handle2, x_handle1, y_handle1]
    }
  }

  if (outboundCase3) {
    position = [x2, y2, x1, y1]
  }

  if (outboundCase4) {
    const { x: xOtherRoot, y: yOtherRoot } = nodeIndex[otherRootId!].position
    const otherHandleIndex = groupIndex[otherGroupId!].indexOf(otherTable)

    const xOtherHandle = xOtherRoot
    const yOtherHandle =
      yOtherRoot - NODE_HEIGHT / 2 + headerSpace + step * (otherHandleIndex + 0.5)

    position = sourceRootId
      ? [xOtherHandle, yOtherHandle, x1, y1]
      : [x2, y2, xOtherHandle, yOtherHandle]

    // TODO: Re-write
    // Table list corner cases:
    if (thisRootId === edge.target) {
      const x_handle = xOtherRoot
      const y_handle = yOtherRoot - NODE_HEIGHT / 2 + headerSpace + step * (thisHandleIndex + 0.5)
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
