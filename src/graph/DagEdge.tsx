import React, { useCallback } from 'react'
import { useGraphStore } from '../graph-common/store'
import { Edge, EdgeProps } from '../CustomGraph'
import { DEFAULT_STROKE } from '../graph-common/constants'

const DagEdge = (props: EdgeProps) => {
  const style = useGraphStore(
    useCallback(state => state.highlights.edges[props.id], [props.id])
  ) ?? {
    stroke: DEFAULT_STROKE,
    strokeWidth: '2px',
  }

  const color = style.stroke
  const fade = style.strokeWidth === '0' ? true : false
  const newProps = { ...props, color, fade }

  return <Edge {...newProps} />
}

export { DagEdge }
