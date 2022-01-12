import React, { ReactNode } from 'react'
import { ANIMATION_TIMEOUT } from '../constants'

const NodePosition = ({ position, fade = false, children }: Props) => {
  const opacity = fade ? '0' : '1'
  return (
    <div
      className="preventZoom"
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        opacity,
        transition: `all ${ANIMATION_TIMEOUT} ease-in-out`,
      }}
    >
      {children}
    </div>
  )
}

export default NodePosition
interface Props {
  position: { x: number; y: number }
  children: ReactNode
  fade?: boolean
}
