import { useEffect } from 'react'
import Panzoom from '@panzoom/panzoom'
import debounce from 'lodash.debounce'

export const usePanZoom = ({
  canvasContainerRef,
  zoomContainerRef,
  excludeClass,
  minScale,
  maxScale,
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

    let prevPosition = { x: 0, y: 0 }
    // This is to distinguish between clicks and drag when panning
    const onPanEnd = debounce(
      (evt: any) => {
        const { x, y } = evt.detail
        if (prevPosition.x !== x || prevPosition.y !== y) {
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
  onPaneClick: () => void
}
