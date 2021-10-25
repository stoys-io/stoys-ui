import React, { ReactNode } from 'react'
import ResizableAntdDrawer from './ResizableAntdDrawer'
import { useGraphStore } from '../graph-store'

export const DrawrWrap = ({ children }: { children: ReactNode }) => {
  const visible = useGraphStore(state => state.drawerNodeId !== undefined)
  const drawerHeight = useGraphStore(state => state.drawerHeight)
  const setDrawerHeight = useGraphStore(state => state.setDrawerHeight)
  const closeDrawer = useGraphStore(state => state.closeDrawer)

  return (
    <ResizableAntdDrawer
      visible={visible}
      setDrawerHeight={setDrawerHeight}
      drawerHeight={drawerHeight}
      closeDrawer={closeDrawer}
    >
      {children}
    </ResizableAntdDrawer>
  )
}
