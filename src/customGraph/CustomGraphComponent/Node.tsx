import React, { ReactNode } from 'react'
import { ANIMATION_TIMEOUT } from './constants'

const Node = ({ x, y, width, height, fade = false, children = defaultNode }: Props) => {
  const opacity = fade
    ? {
        opacity: 0,
      }
    : {
        opacity: 1,
      }

  return (
    <div
      className="preventZoom"
      style={{
        position: 'absolute',
        top: y,
        left: x,
        width,
        height,
        transition: `all ${ANIMATION_TIMEOUT} ease-in-out`,
        ...opacity,
      }}
    >
      {children}
    </div>
  )
}

export default Node

export interface Props {
  id: string
  x: number
  y: number
  width: number
  height: number
  children: ReactNode
  fade?: boolean
}

export const defaultNode = ({ label }: { label: string }) => (
  <div style={{ border: '1px solid magenta', width: '100%', height: '100%' }}>{label}</div>
)
