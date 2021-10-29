import React, { useCallback } from 'react'
import { EdgeProps, getBezierPath, getMarkerEnd } from 'react-flow-renderer'
import { useGraphStore } from '../StoreProvider'

export const DagEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  arrowHeadType,
  markerEndId,
}: EdgeProps) => {
  const style = useGraphStore(useCallback(state => state.highlights.edges[id], [id]))

  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId)

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <text>
        <textPath
          href={`#${id}`}
          style={{ fontSize: '12px' }}
          startOffset="50%"
          textAnchor="middle"
        >
          {data.text}
        </textPath>
      </text>
    </>
  )
}
