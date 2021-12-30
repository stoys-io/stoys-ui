import React, { RefObject } from 'react'
import Drawer from './Drawer'
import DrawerTabs from './DrawerTabs'
import { useGraphStore } from '../store'

const ConnectedDrawer = ({ isOpenDrawer, containerRef }: Props) => {
  const visible = useGraphStore(state => state.drawerNodeId !== undefined) || isOpenDrawer

  return (
    <Drawer visible={visible} containerRef={containerRef}>
      {visible && <DrawerTabs />}
    </Drawer>
  )
}

export default ConnectedDrawer

interface Props {
  isOpenDrawer: boolean
  containerRef?: RefObject<HTMLDivElement>
}
