import React from 'react'
import Drawer from 'antd/lib/drawer'

import 'antd/lib/drawer/style/css'

import { JsonDrqwerProps } from '../model'

const JsonDrawer = ({ visible, onClose, datasets }: JsonDrqwerProps): JSX.Element => {
  return (
    <Drawer
      placement="right"
      closable={false}
      onClose={onClose}
      visible={visible}
      getContainer={false}
      width="50%"
      style={{ position: 'absolute' }}
      destroyOnClose
    >
      <pre>{JSON.stringify(datasets, null, 2)}</pre>
    </Drawer>
  )
}

export default JsonDrawer
