import React, { ReactNode, RefObject } from 'react'
import Drawer from './Drawer'
import { useGraphStore } from '../StoreProvider'

export const ConnectedDrawer = ({ children, containerRef }: Props) => {
  const visible = useGraphStore(state => state.drawerNodeId !== undefined)
  const drawerHeight = useGraphStore(state => state.drawerHeight)
  const setDrawerHeight = useGraphStore(state => state.setDrawerHeight)

  return (
    <Drawer
      visible={visible}
      setDrawerHeight={setDrawerHeight}
      drawerHeight={drawerHeight}
      containerRef={containerRef}
    >
      {visible && children}
    </Drawer>
  )
}
interface Props {
  children: ReactNode
  containerRef?: RefObject<HTMLDivElement>
}
