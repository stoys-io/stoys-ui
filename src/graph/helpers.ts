import { nodes } from './__mocks__/Nodes.mock'
import { edges } from './__mocks__/Edges.mock'
import { combos } from './__mocks__/Combos.mock'

export const getData = () => {
  return {
    nodes: nodes.map((node) => ({
      ...node,
      // size: [150, 30],
      // style: {
      //   badges: [
      //     {
      //       position: 'RT',
      //       type: 'text',
      //       value: 8,
      //       size: [20, 20],
      //       color: '#fff',
      //       fill: 'red',
      //     },
      //   ],
      // }

    })),
    edges,
    combos,
  }
}

export const getLabelText = (label: string) => {
  if (label.length > 17) {
    return `${label.slice(0, 15)}...`
  }
  return label
}
