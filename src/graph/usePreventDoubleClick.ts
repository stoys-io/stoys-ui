import { useState, useRef, useCallback } from 'react'

export const usePreventDoubleClick = (cb: Function, delay: number = 250) => {
  const [clicked, setClicked] = useState<boolean>(false)
  const timeout = useRef<any>(null)

  const fn = useCallback(
    (...args) => {
      if (!clicked) {
        timeout.current = setTimeout(() => {
          cb(...args)
          setClicked(false)
        }, delay)

        return setClicked(true)
      }

      clearTimeout(timeout.current)
      return setClicked(false)
    },
    [clicked]
  )

  return fn
}
