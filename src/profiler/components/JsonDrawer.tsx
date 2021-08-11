import React from 'react'
import Drawer from 'antd/lib/drawer'

import 'antd/lib/drawer/style/css'

import { JsonDrqwerProps } from '../model'

const JsonDrawer = ({ visible, onClose }: JsonDrqwerProps): JSX.Element => {
  return (
    <Drawer
      title="Basic Drawer"
      placement="right"
      closable
      onClose={onClose}
      visible={visible}
      getContainer={false}
      width="50%"
      style={{ position: 'absolute' }}
    >
      <p>Some contents...</p>
    </Drawer>
  )
}

export default JsonDrawer
