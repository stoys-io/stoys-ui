import React, { ReactNode } from 'react'
import ResizableAntdDrawer from './ResizableAntdDrawer'
import { useGraphStore } from '../graph-store'

export const DrawrWrap = ({ children }: { children: ReactNode }) => {
  /* const drawerNodeId = useGraphStore(state => state.drawerNodeId) */
  /* const visible = drawerNodeId !== undefined */

  /* const drawerHeight = useGraphStore(state => state.drawerHeight) */
  const setDrawerHeight = useGraphStore(state => state.setDrawerHeight)

  return <ResizableAntdDrawer setDrawerHeight={setDrawerHeight}>{children}</ResizableAntdDrawer>
}
