import React, { ReactNode } from 'react'
import Drawer from './Drawer'
import { useGraphStore } from '../graph-store'

export const ConnectedDrawer = ({ children }: { children: ReactNode }) => {
  const visible = useGraphStore(state => state.drawerNodeId !== undefined)
  const drawerHeight = useGraphStore(state => state.drawerHeight)
  const setDrawerHeight = useGraphStore(state => state.setDrawerHeight)

  return (
    <Drawer visible={visible} setDrawerHeight={setDrawerHeight} drawerHeight={drawerHeight}>
      {visible && children}
    </Drawer>
  )
}
