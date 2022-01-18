import React from 'react'

const DefaultNode = (props: Props) => (
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
interface Props {
  data?: { label: string }
}
