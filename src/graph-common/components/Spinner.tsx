import React, { CSSProperties } from 'react'
import Spin from 'antd/lib/spin'

const Spinner = ({ spinning }: Props) => (
  <Spin style={style} size="large" tip="Loading..." spinning={spinning} />
)

export default Spinner

interface Props {
  spinning: boolean
}

const style: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
}
