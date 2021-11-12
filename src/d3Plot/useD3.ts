import React, { useEffect } from 'react'
import * as d3 from 'd3'

const useD3 = (renderChartFn: any, dependencies: any) => {
  const ref = React.useRef()

  useEffect(() => {
    renderChartFn(d3.select(ref.current as any))
  }, dependencies)
  return ref
}

export default useD3
