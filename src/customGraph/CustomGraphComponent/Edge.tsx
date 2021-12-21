import React from 'react'
import { ANIMATION_TIMEOUT } from './constants'

const Edge = ({ path: d, id, color, isVisible }: Props) => {
  const strokeOpacity = isVisible ? '1' : '0'
  const strokeWidth = isVisible ? '1' : '0' // TODO: Actually we don't need this. strokeOpacity is enough

  return (
    <path
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
  color: string
  isVisible: boolean
}

const style = { transition: `all ${ANIMATION_TIMEOUT} ease-in-out` }
