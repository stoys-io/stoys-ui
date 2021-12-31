import React from 'react'
import { NodeData } from './types'

const DefaultNode = (props: NodeData) => (
  <div
    style={{
      border: '1px solid magenta',
      width: 60,
      height: 40,
    }}
  >
    {props.data?.label}
  </div>
)

export default DefaultNode
