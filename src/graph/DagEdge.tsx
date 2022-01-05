import React, { useCallback } from 'react'
import { useGraphStore } from '../graph-common/store'
import { Edge, EdgeProps } from '../CustomGraph'

const defaultStroke = '#b1b1b7'
const DagEdge = (props: EdgeProps) => {
  const style = useGraphStore(
    useCallback(state => state.highlights.edges[props.id], [props.id])
  ) ?? {
    stroke: defaultStroke,
    strokeWidth: '2px',
  }

  const color = style.stroke
  const fade = style.strokeWidth === '0' ? true : false
  const newProps = { ...props, color, fade }

  return <Edge {...newProps} />
}

export { DagEdge }
