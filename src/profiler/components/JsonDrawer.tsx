import React, { useEffect, useRef } from 'react'
import Drawer from 'antd/lib/drawer'
import { BigJsonViewerDom } from 'big-json-viewer'

import 'antd/lib/drawer/style/css'
import 'big-json-viewer/styles/default.css'

import { JsonDrqwerProps } from '../model'

const JsonDrawer = ({ visible, onClose, datasets }: JsonDrqwerProps): JSX.Element => {
  const jsonViewerRef = useRef<any>(null)

  useEffect(() => {
    const initJsonViewer = async () => {
      const viewer = await BigJsonViewerDom.fromObject(datasets, {
        linkLabelCopyPath: undefined,
        linkLabelExpandAll: undefined,
      })
      const node = viewer.getRootElement()
      jsonViewerRef.current.appendChild(node)
      await node.openAll()

      if (!visible) {
        viewer.destroy()
      }
    }

    // tslint:disable-next-line: no-floating-promises
    initJsonViewer()
  }, [datasets, visible])

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
      <div ref={jsonViewerRef} />
      {/* <pre>{JSON.stringify(datasets, null, 2)}</pre> */}
    </Drawer>
  )
}

export default JsonDrawer
