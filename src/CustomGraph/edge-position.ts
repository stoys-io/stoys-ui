import { NODE_HEIGHT } from '../graph-common/constants'
import { EdgeData, GroupIndex, NodeGroups, NodeIndex, Position } from './types'

export const edgePosition = (
  edge: EdgeData,
  nodeIndex: NodeIndex,
  groups: NodeGroups,
  groupIndex: GroupIndex,
  groupNodePosition: (group: string) => Position
): EdgePosition => {
  const {
    position: { x: x1, y: y1 },
    groupId: sourceGroupId,
  } = nodeIndex[edge.source]
  const {
    position: { x: x2, y: y2 },
    groupId: targetGroupId,
  } = nodeIndex[edge.target]

  const isSourceRegular = sourceGroupId === undefined
  const isTargetRegular = targetGroupId === undefined

  const isRegularEdge = isSourceRegular && isTargetRegular
  if (isRegularEdge) {
    return { position: [x2, y2, x1, y1], isHidden: false }
  }

  // Group edges:
  const isEdgeOutbound =
    (isSourceRegular && !isTargetRegular) ||
    (!isSourceRegular && isTargetRegular) ||
    (isSourceRegular && isTargetRegular && sourceGroupId !== targetGroupId)

  const isSourceGroupOpen = !isSourceRegular && groups[sourceGroupId]
  const isSourceGroupClosed = !isSourceRegular && !groups[sourceGroupId]

  const isTargetGroupOpen = !isTargetRegular && groups[targetGroupId]
  const isTargetGroupClosed = !isTargetRegular && !groups[targetGroupId]

  // Inbound edge open group
  if (!isEdgeOutbound && (isSourceGroupOpen || isTargetGroupOpen)) {
    return { position: [x2, y2, x1, y1], isHidden: false }
  }

  if (!isEdgeOutbound && (isSourceGroupClosed || isTargetGroupClosed)) {
    console.log(nodeIndex[edge.source].data?.label, nodeIndex[edge.target].data?.label)
    return { position: [x2, y2, x1, y1], isHidden: true }
  }

  // Inbound edge closed group
  // if (!isEdgeOutbound && isSourceGroupClosed) {
  //   const { x: xRoot, y: yRoot } = groupNodePosition(sourceGroupId)
  //   const position: Pos = [x2, y2, xRoot, yRoot]
  //   return { position, isHidden: true }
  // }

  // if (!isEdgeOutbound && isTargetGroupClosed) {
  //   const { x: xRoot, y: yRoot } = groupNodePosition(targetGroupId)
  //   const position: Pos = [xRoot, yRoot, x1, y1]
  //   return { position, isHidden: true }
  // }

  // TODO: This could have been simpler
  // Outbound edge:
  let position: Pos = [0, 0, 0, 0]

  // const thisGroupId = sourceGroupId ? sourceGroupId : targetGroupId
  // const otherGroupId = sourceGroupId ? targetGroupId : sourceGroupId

  // const thisTable = sourceGroupId ? edge.source : edge.target
  // const otherTable = sourceGroupId ? edge.target : edge.target

  // const { x: xThisRoot, y: yThisRoot } = nodeIndex[thisRootId].position
  // const thisHandleIndex = groupIndex[thisGroupId!].indexOf(thisTable)
  // const xThisHandle = xThisRoot
  // const yThisHandle = shiftYHandle(yThisRoot, thisHandleIndex)

  // const thisGroupOpen = sourceRootId ? isSourceGroupOpen : isTargetGroupOpen
  // const otherNodeVisible = sourceRootId
  //   ? targetGroupId === undefined || isTargetGroupOpen
  //   : sourceGroupId === undefined || isSourceGroupOpen

  // const outboundCase1 = !thisGroupOpen && otherNodeVisible
  // const outboundCase2 = !thisGroupOpen && !otherNodeVisible
  // const outboundCase3 = thisGroupOpen && otherNodeVisible
  // const outboundCase4 = thisGroupOpen && !otherNodeVisible

  // if (outboundCase1) {
  //   position = sourceRootId
  //     ? [x2, y2, xThisHandle, yThisHandle]
  //     : [xThisHandle, yThisHandle, x1, y1]

  //   // TODO: Re-write
  //   // Table list corner cases:
  //   if (thisRootId === edge.target) {
  //     const otherHandleIndex = groupIndex[otherGroupId!].indexOf(otherTable)
  //     const x_handle = xThisRoot
  //     const y_handle = shiftYHandle(yThisRoot, otherHandleIndex)
  //     position = [x_handle, y_handle, x1, y1]
  //   }
  // }

  // if (outboundCase2) {
  //   const { x: xOtherRoot, y: yOtherRoot } = nodeIndex[otherRootId!].position
  //   const otherHandleIndex = groupIndex[otherGroupId!].indexOf(otherTable)
  //   const xOtherHandle = xOtherRoot
  //   const yOtherHandle = shiftYHandle(yOtherRoot, otherHandleIndex)

  //   position = sourceRootId
  //     ? [xOtherHandle, yOtherHandle, xThisHandle, yThisHandle]
  //     : [xThisHandle, yThisHandle, xOtherHandle, yOtherHandle]

  //   // TODO: Re-write
  //   // Table list corner cases:
  //   if (thisRootId === edge.target) {
  //     const x_handle2 = xThisRoot
  //     const y_handle2 = shiftYHandle(yThisRoot, otherHandleIndex)

  //     const x_handle1 = xOtherRoot
  //     const y_handle1 = shiftYHandle(yOtherRoot, thisHandleIndex)

  //     position = [x_handle2, y_handle2, x_handle1, y_handle1]
  //   }
  // }

  // if (outboundCase3) {
  //   position = [x2, y2, x1, y1]
  // }

  // if (outboundCase4) {
  //   const { x: xOtherRoot, y: yOtherRoot } = nodeIndex[otherRootId!].position
  //   const otherHandleIndex = groupIndex[otherGroupId!].indexOf(otherTable)

  //   const xOtherHandle = xOtherRoot
  //   const yOtherHandle = shiftYHandle(yOtherRoot, otherHandleIndex)

  //   position = sourceRootId
  //     ? [xOtherHandle, yOtherHandle, x1, y1]
  //     : [x2, y2, xOtherHandle, yOtherHandle]

  //   // TODO: Re-write
  //   // Table list corner cases:
  //   if (thisRootId === edge.target) {
  //     const x_handle = xOtherRoot
  //     const y_handle = shiftYHandle(yOtherRoot, thisHandleIndex)

  //     position = [x2, y2, x_handle, y_handle]
  //   }
  // }

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
