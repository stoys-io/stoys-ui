import React from 'react'
import { NodeProps } from './types'

export const DefaultNode = (props: NodeProps<any>) => (
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
