import React from 'react'
import { ANIMATION_TIMEOUT, DEFAULT_EDGE_COLOR } from './constants'

const Edge = ({ path: d, id, color = DEFAULT_EDGE_COLOR, fade = false }: Props) => {
  const strokeOpacity = fade ? '0' : '1'
  const strokeWidth = fade ? '0' : '1' // TODO: Actually we don't need this. strokeOpacity is enough

  return (
    <path
      key={id}
      d={d}
      style={style}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity}
      fill="transparent"
    />
  )
}

export default Edge

export interface Props {
  id: string
  path: string
  color?: string
  fade?: boolean
}

const style = { transition: `all ${ANIMATION_TIMEOUT} ease-in-out` }
