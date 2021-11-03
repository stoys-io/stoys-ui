import React, { ReactNode, RefObject } from 'react'
import Drawer from './Drawer'
import { useGraphStore } from '../StoreProvider'

export const ConnectedDrawer = ({ children, isOpenDrawer, containerRef }: Props) => {
  const visible = useGraphStore(state => state.drawerNodeId !== undefined) || isOpenDrawer

  return (
    <Drawer visible={visible} containerRef={containerRef}>
      {visible && children}
    </Drawer>
  )
}
interface Props {
  children: ReactNode
  isOpenDrawer: boolean
  containerRef?: RefObject<HTMLDivElement>
}
