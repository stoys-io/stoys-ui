import { EdgeData, NodeGroups, NodeIndex } from './types'

export const edgePosition = (
  edge: EdgeData,
  nodeIndex: NodeIndex,
  groups: NodeGroups
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

  const { x: xThisRoot, y: yThisRoot } = nodeIndex[thisRootId].position

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
    position = sourceRootId ? [x2, y2, xThisRoot, yThisRoot] : [xThisRoot, yThisRoot, x1, y1]
  }

  if (outboundCase2) {
    const { x: xOtherRoot, y: yOtherRoot } = nodeIndex[otherRootId!].position
    position = sourceRootId
      ? [xOtherRoot, yOtherRoot, xThisRoot, yThisRoot]
      : [xThisRoot, yThisRoot, xOtherRoot, yOtherRoot]
  }

  if (outboundCase3) {
    position = [x2, y2, x1, y1]
  }

  if (outboundCase4) {
    const { x: xOtherRoot, y: yOtherRoot } = nodeIndex[otherRootId!].position
    position = sourceRootId ? [xOtherRoot, yOtherRoot, x1, y1] : [x2, y2, xOtherRoot, yOtherRoot]
  }

  return { position, isHidden: false }
}

interface EdgePosition {
  position: Pos
  isHidden: boolean
}

type Pos = [x1: number, y1: number, x2: number, y2: number]
