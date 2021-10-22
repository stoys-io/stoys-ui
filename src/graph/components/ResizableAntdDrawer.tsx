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
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isResizing === false) {
        return
      }

      const height = document.body.offsetHeight - e.clientY
      console.log(height)

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
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
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
      <ResizeArea onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} />
      {drawerHeight > RESIZE_AREA_HIGHT && <DrawerContent>{children}</DrawerContent>}
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
