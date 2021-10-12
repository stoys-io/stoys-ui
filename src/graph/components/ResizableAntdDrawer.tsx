import React, { ReactNode, useCallback, Dispatch, SetStateAction } from 'react'
import { ResizeArea, ResizeIcon, StyledDrawer } from '../styles'

type ResizableAntdDrawerProps = {
  drawerHeight: number
  setDrawerHeight: Dispatch<SetStateAction<number>>
  visible: boolean
  setDrawerVisibility: Dispatch<SetStateAction<boolean>>
  children: ReactNode
}

let isResizing: boolean = false

const ResizableAntdDrawer = ({
  children,
  drawerHeight,
  setDrawerHeight,
  visible,
  setDrawerVisibility,
}: ResizableAntdDrawerProps) => {
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const height = document.body.offsetHeight - e.clientY
    let minHeight = 100
    let maxHeight = document.body.offsetHeight * 0.9
    if (height > minHeight && height < maxHeight) {
      setDrawerHeight(height)
    }
  }, [])

  const handleMouseUp = useCallback(() => {
    if (!isResizing) {
      return
    }
    isResizing = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }, [])

  const handleMousedown = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    isResizing = true
  }

  return (
    <StyledDrawer
      getContainer={false}
      placement="bottom"
      closable
      visible={visible}
      onClose={() => setDrawerVisibility(false)}
      height={drawerHeight}
    >
      {visible ? <ResizeIcon /> : null}
      <ResizeArea onMouseDown={handleMousedown} />
      {children}
    </StyledDrawer>
  )
}

export default ResizableAntdDrawer
