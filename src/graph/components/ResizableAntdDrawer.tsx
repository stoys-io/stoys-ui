import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { RESIZE_AREA_HIGHT } from '../constants'
import { ResizeArea, StyledDrawer, DrawerContent } from '../styles'

const ResizableAntdDrawer = ({
  children,
  drawerHeight,
  setDrawerHeight,
  visible,
  closeDrawer,
}: Props) => {
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const height = document.body.offsetHeight - e.clientY

    const maxHeight = document.body.offsetHeight * 0.9
    if (height > RESIZE_AREA_HIGHT && height < maxHeight) {
      setDrawerHeight(height)
    }
  }, [])

  const handleMouseUp = useCallback(() => {
    if (drawerHeight < minHeight) {
      setDrawerHeight(RESIZE_AREA_HIGHT)
    }
    setIsResizing(false)
  }, [drawerHeight])

  const handleMouseDown = useCallback(() => {
    setIsResizing(true)
  }, [])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp) // Depends on drawerHeight
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, drawerHeight])

  return (
    <StyledDrawer
      getContainer={false}
      placement="bottom"
      closable={false}
      visible={visible}
      onClose={closeDrawer}
      height={drawerHeight}
    >
      <ResizeArea onMouseDown={handleMouseDown} />
      <DrawerContent>{children}</DrawerContent>
    </StyledDrawer>
  )
}

export default ResizableAntdDrawer

interface Props {
  drawerHeight: number
  setDrawerHeight: (_: number) => void
  visible: boolean
  closeDrawer: () => void
  children: ReactNode
}

const minHeight = RESIZE_AREA_HIGHT + 150
