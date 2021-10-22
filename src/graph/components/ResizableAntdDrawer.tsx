import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { RESIZE_AREA_HIGHT } from '../constants'
import { ResizeArea, StyledDrawer } from '../styles'

type ResizableAntdDrawerProps = {
  drawerHeight: number
  setDrawerHeight: (_: number) => void
  visible: boolean
  closeDrawer: () => void
  children: ReactNode
}

const minHeight = RESIZE_AREA_HIGHT + 150
const ResizableAntdDrawer = ({
  children,
  drawerHeight,
  setDrawerHeight,
  visible,
  closeDrawer,
}: ResizableAntdDrawerProps) => {
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isResizing === false) {
        return
      }

      const height = document.body.offsetHeight - e.clientY
      const maxHeight = document.body.offsetHeight * 0.9
      if (height > RESIZE_AREA_HIGHT && height < maxHeight) {
        setDrawerHeight(height)
      }
    },
    [isResizing]
  )

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
    if (drawerHeight < minHeight) {
      setDrawerHeight(RESIZE_AREA_HIGHT)
    }
  }, [drawerHeight])

  const handleMouseDown = useCallback(() => {
    setIsResizing(true)
  }, [])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  return (
    <StyledDrawer
      getContainer={false}
      placement="bottom"
      closable
      visible={visible}
      onClose={closeDrawer}
      height={drawerHeight}
    >
      <ResizeArea onMouseDown={handleMouseDown} />
      {drawerHeight > RESIZE_AREA_HIGHT && children}
    </StyledDrawer>
  )
}

export default ResizableAntdDrawer
