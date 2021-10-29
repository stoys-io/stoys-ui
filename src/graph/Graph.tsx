import React from 'react'
import GraphComponent, { Props } from './GraphComponent'
import { StoreProvider } from './StoreProvider'

const Graph = (props: Props) => (
  <StoreProvider>
    <GraphComponent {...props} />
  </StoreProvider>
)

export default Graph
export { Props }
