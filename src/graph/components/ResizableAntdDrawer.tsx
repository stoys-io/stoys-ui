import React, { ReactNode, useRef, useCallback, useEffect, useState } from 'react'
import { RESIZE_AREA_HIGHT } from '../constants'
import { useGraphStore } from '../graph-store'
import { ResizeArea, DrawerContent, Drawr } from '../styles'

const ResizableAntdDrawer = ({ children, setDrawerHeight }: Props) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const drawrRef = useRef<HTMLDivElement>(null)
  const getDrawerHeight = useGraphStore(state => state.getDrawerHeight)

  const [hiddenHeight, setHiddenHeight] = useState<number>(0)
  const [isResizing, setIsResizing] = useState<boolean>(false)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const height = document.body.offsetHeight - e.clientY

      const maxHeight = document.body.offsetHeight * 0.9
      if (height < maxHeight) {
        setDrawerHeight(height)

        if (drawrRef.current) {
          drawrRef.current.style.bottom = `${-hiddenHeight - RESIZE_AREA_HIGHT + height}px`
        }
      }
    },
    [hiddenHeight]
  )

  const handleMouseUp = useCallback(() => {
    const dHeight = getDrawerHeight()
    if (dHeight < minHeight) {
      setDrawerHeight(RESIZE_AREA_HIGHT)

      if (drawrRef.current) {
        drawrRef.current.style.bottom = `${-hiddenHeight}px`
      }
    }
    setIsResizing(false)
  }, [hiddenHeight])

  const handleMouseDown = useCallback(() => {
    setIsResizing(true)
  }, [])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, hiddenHeight])

  useEffect(() => {
    if (contentRef.current?.clientHeight) {
      const contentHeight = contentRef.current?.clientHeight ?? 0
      console.log(contentHeight)

      setHiddenHeight(contentHeight)
    }
  }, [contentRef.current, children])

  return (
    <Drawr ref={drawrRef}>
      <ResizeArea onMouseDown={handleMouseDown} />
      <div ref={contentRef}>
        <DrawerContent>{children}</DrawerContent>
      </div>
    </Drawr>
  )
}

export default ResizableAntdDrawer

interface Props {
  /* drawerHeight: number */
  setDrawerHeight: (_: number) => void
  /* visible: boolean */
  /* closeDrawer: () => void */
  children: ReactNode
}

const minHeight = RESIZE_AREA_HIGHT + 150
