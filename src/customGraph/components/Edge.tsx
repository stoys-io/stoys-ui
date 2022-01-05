import React from 'react'
import { ANIMATION_TIMEOUT, DEFAULT_EDGE_COLOR } from '../constants'

const Edge = ({ path: d, id, color = DEFAULT_EDGE_COLOR, width = '2px', fade = false }: Props) => {
  const strokeOpacity = fade ? '0' : '1'

  return (
    <path
      key={id}
      d={d}
      style={style}
      stroke={color}
      strokeWidth={width}
      strokeOpacity={strokeOpacity}
      fill="transparent"
    />
  )
}
const style = { transition: `all ${ANIMATION_TIMEOUT} ease-in-out` }

export default Edge
export interface Props {
  id: string
  path: string
  color?: string
  width?: string
  fade?: boolean
}
