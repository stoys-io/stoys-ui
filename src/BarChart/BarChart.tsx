import React, { useMemo } from 'react'
import * as d3 from 'd3'

import { useD3 } from '../hooks'
import { DiscreteItem } from '../profiler/model'

const BarChart = ({
  dataset,
  config,
}: {
  dataset: Array<Array<DiscreteItem>>
  config: any
}): JSX.Element => {
  const ref = useD3(
    (svg: any) => {
      // TODO: bar chart here
    },
    [config]
  )

  return <svg ref={ref as any} />
}

export default BarChart
