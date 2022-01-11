import React, { ReactNode, useCallback, useState, RefObject, useEffect } from 'react'

import AntDrawer from 'antd/lib/drawer'
import { RESIZE_AREA_HEIGHT } from '../constants'
import { ResizeArea } from '../styles'

const Drawer = ({ children, visible, containerRef }: Props) => {
  const [drawerHeight, setDrawerHeight] = useState<number>(0)
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

  const debouncedHeight = useDebounce(drawerHeight)

  const childrenWithHeight = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        drawerHeight: debouncedHeight,
        key: typeof child.type === 'string' ? child.type : child.type.name,
      })
    }

    return child
  })

  useEffect(() => {
    // Set initial height of 40% of Container
    if (containerRef?.current) {
      const initialHeight = Math.ceil((containerRef?.current?.offsetHeight ?? 0) * 0.4)
      setDrawerHeight(initialHeight)
    }
  }, [])

  return (
    <AntDrawer
      title={<ResizeArea onMouseDown={handleMouseDown} />}
      getContainer={false}
      placement="bottom"
      closable={false}
      mask={false}
      visible={visible}
      height={drawerHeight}
      headerStyle={headerStyle}
      bodyStyle={bodyStyle}
    >
      {childrenWithHeight}
    </AntDrawer>
  )
}

export default Drawer

interface Props {
  visible: boolean
  children: ReactNode
  containerRef?: RefObject<HTMLDivElement>
}

const threshold = RESIZE_AREA_HEIGHT + 150

const bodyStyle = { padding: 0 }
const headerStyle = { padding: 0 }

export function useDebounce<T>(value: T, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value])

  return debouncedValue
}
