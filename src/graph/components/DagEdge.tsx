import React, { useCallback } from 'react'
import { EdgeProps, getBezierPath, getMarkerEnd } from 'react-flow-renderer'
import { useGraphStore } from '../graph-store'
import { EdgeDataPayload } from '../model'

export const DagEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: /* arrowHeadType, */
/* markerEndId, */
EdgeProps<EdgeDataPayload>) => {
  const style = useGraphStore(useCallback(state => state.highlights.edges[id], [id]))

  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })
  /* const markerEnd = getMarkerEnd(arrowHeadType, markerEndId) */

  return <path id={id} style={style} className="react-flow__edge-path" d={edgePath} />
}
