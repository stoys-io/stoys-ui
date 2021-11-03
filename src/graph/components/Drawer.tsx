import React, { CSSProperties, ReactNode, useCallback, useEffect, useState, RefObject } from 'react'

import AntDrawer from 'antd/lib/drawer'
import { RESIZE_AREA_HEIGHT } from '../constants'
import { ResizeArea, DrawerContent } from '../styles'

const Drawer = ({ children, drawerHeight, setDrawerHeight, visible, containerRef }: Props) => {
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const containerHeight = containerRef?.current?.offsetHeight ?? 0
      const containerTop = containerRef?.current?.getBoundingClientRect().top ?? 0

      const containerY = e.clientY - containerTop
      const height = containerHeight - containerY

      const maxHeight = containerHeight * 0.9
      if (height > RESIZE_AREA_HEIGHT && height < maxHeight) {
        setDrawerHeight(height)
      }
    },
    [containerRef]
  )

  const handleMouseUp = useCallback(() => {
    if (drawerHeight < threshold) {
      setDrawerHeight(RESIZE_AREA_HEIGHT)
    }
    setIsResizing(false)
  }, [drawerHeight])

  const handleMouseDown = useCallback(() => {
    setIsResizing(true)
  }, [])

  useEffect(() => {
    const container = containerRef?.current
    if (isResizing) {
      container?.addEventListener('mousemove', handleMouseMove)
      container?.addEventListener('mouseup', handleMouseUp) // Depends on drawerHeight
    } else {
      container?.removeEventListener('mousemove', handleMouseMove)
      container?.removeEventListener('mouseup', handleMouseUp)
    }

    return () => {
      container?.removeEventListener('mousemove', handleMouseMove)
      container?.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, drawerHeight, containerRef?.current])

  return (
    <AntDrawer
      title={<ResizeArea onMouseDown={handleMouseDown} />}
      getContainer={false}
      placement="bottom"
      closable={false}
      mask={false}
      visible={visible}
      height={drawerHeight}
      style={style}
      headerStyle={headerStyle}
      bodyStyle={bodyStyle}
    >
      <DrawerContent>{children}</DrawerContent>
    </AntDrawer>
  )
}

export default Drawer

interface Props {
  drawerHeight: number
  setDrawerHeight: (_: number) => void
  visible: boolean
  children: ReactNode
  containerRef?: RefObject<HTMLDivElement>
}

const threshold = RESIZE_AREA_HEIGHT + 150

const style: CSSProperties = { position: 'absolute' }
const bodyStyle = { padding: 0 }
const headerStyle = { padding: 0 }
