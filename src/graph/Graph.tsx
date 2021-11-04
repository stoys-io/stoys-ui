import React from 'react'
import GraphComponent, { Props } from './GraphComponent'
import { StoreProvider } from './graph-store'

const Graph = (props: Props) => (
  <StoreProvider>
    <GraphComponent {...props} />
  </StoreProvider>
)

export default Graph
export { Props }
