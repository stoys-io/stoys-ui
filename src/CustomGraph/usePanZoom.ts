import { useEffect } from 'react'
import Panzoom, { PanzoomObject } from '@panzoom/panzoom'
import debounce from 'lodash.debounce'

export const usePanZoom = ({
  canvasContainerRef,
  zoomContainerRef,
  excludeClass,
  minScale,
  maxScale,
  onInit,
  onPaneClick,
}: IUsePanZoom) => {
  useEffect(() => {
    if (!zoomContainerRef.current || !canvasContainerRef.current) {
      return
    }

    const panzoom = Panzoom(zoomContainerRef.current, {
      minScale,
      maxScale,
      cursor: 'default',
      step: 0.2,
      canvas: true,
      animate: true,
      excludeClass,
    })

    const onWheel = (evt: WheelEvent) => {
      const shouldPreventZoom = (evt.target as Element).closest(`.${excludeClass}`)
      if (shouldPreventZoom) {
        return
      }

      panzoom.zoomWithWheel(evt)
    }

    // This is to distinguish between clicks and drag when panning
    let prevPosition = { x: 0, y: 0 }
    const onPanEnd = debounce(
      (evt: any) => {
        const { x, y } = evt.detail
        const dx = Math.abs(prevPosition.x - x)
        const dy = Math.abs(prevPosition.y - y)
        // Threshold to ignore accidental mouse moves when clicking on the background
        if (dx > threshold || dy > threshold) {
          prevPosition = { x, y }
          return
        }

        prevPosition = { x, y }
        onPaneClick()
        return
      },
      250,
      { leading: true, trailing: false }
    )

    onInit(panzoom)
    zoomContainerRef.current.addEventListener('panzoomend', onPanEnd)
    canvasContainerRef.current.addEventListener('wheel', onWheel)
    return () => {
      zoomContainerRef.current?.removeEventListener('panzoomend', onPanEnd)
      canvasContainerRef.current?.removeEventListener('wheel', onWheel)
    }
  }, [])
}

interface IUsePanZoom {
  canvasContainerRef: React.RefObject<HTMLDivElement>
  zoomContainerRef: React.RefObject<HTMLDivElement>
  excludeClass: string
  maxScale: number
  minScale: number
  onInit: (_: PanzoomObject) => void
  onPaneClick: () => void
}

const threshold = 10
