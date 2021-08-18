import { nodes } from './__mocks__/Nodes.mock'
import { edges } from './__mocks__/Edges.mock'
import { combos } from './__mocks__/Combos.mock'

export const getData = () => {
  return {
    nodes: nodes.map((node) => ({
      ...node,
      size: [150, 30],
    })),
    edges,
    combos,
  }
}
