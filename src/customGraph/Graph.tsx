import React from 'react'
import GraphScreen, { Props } from './GraphScreen'
import { StoreProvider } from '../graph/graph-store'

const Graph = (props: Props) => (
  <StoreProvider>
    <GraphScreen {...props} />
  </StoreProvider>
)

export default Graph
export { Props }
