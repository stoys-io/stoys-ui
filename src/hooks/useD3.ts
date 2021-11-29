import React, { useEffect } from 'react'
import * as d3 from 'd3'

const useD3 = (
  renderChartFn: (node: d3.Selection<HTMLElement, null, null, undefined>) => void,
  dependencies: Array<any>
) => {
  const ref = React.useRef<HTMLElement>(null)

  useEffect(() => {
    if (ref.current) {
      renderChartFn(d3.select(ref.current))
    }

    return () => {
      if (ref.current) {
        ref.current.innerHTML = ''
      }
    }
  }, dependencies)
  return ref
}

export default useD3
