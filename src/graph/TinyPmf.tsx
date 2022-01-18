import React from 'react'
import PmfPlot from '../pmfPlot'
import { PmfPlotItem } from '../profiler/model'

const TinyPmf = ({ dataset }: Props) => (
  <div style={containerStyle}>
    <PmfPlot
      dataset={dataset}
      config={{
        dataType: 'integer',
        height: 23,
        showAxes: false,
        showLogScale: false,
      }}
    />
  </div>
)

export default TinyPmf

interface Props {
  dataset: PmfPlotItem[][]
}

const containerStyle = { width: '50px', marginBottom: '-8px' }
