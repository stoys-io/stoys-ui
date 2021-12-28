import React, { useCallback } from 'react'
import { useGraphStore } from '../graph/graph-store'
import { Edge, EdgeProps } from '../CustomGraphComponent'

const defaultStroke = '#b1b1b7'
const DagEdge = (props: EdgeProps) => {
  const style = useGraphStore(
    useCallback(state => state.highlights.edges[props.id], [props.id])
  ) ?? {
    stroke: defaultStroke,
    strokeWidth: '1',
  }

  const color = style.stroke
  const newProps = { ...props, color }

  return <Edge {...newProps} />
}

export { DagEdge }
