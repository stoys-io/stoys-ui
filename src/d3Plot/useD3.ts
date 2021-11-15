import React, { useEffect } from 'react'
import * as d3 from 'd3'

const useD3 = (renderChartFn: any, dependencies: any) => {
  const ref = React.useRef()

  useEffect(() => {
    renderChartFn(d3.select(ref.current as any))

    return () => {
      ;(ref.current as any).innerHTML = ''
    }
  }, dependencies)
  return ref
}

export default useD3
