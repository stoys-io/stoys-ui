import { Position } from './types'

export const createEdgePath =
  (nodeWidth: number, nodeHeight: number) => (x1: number, y1: number, x2: number, y2: number) => {
    const x1_prime = x1 + nodeWidth
    const y1_prime = y1 + nodeHeight / 2
    const x2_prime = x2
    const y2_prime = y2 + nodeHeight / 2

    const cx = x1_prime + (x2_prime - x1_prime) / 2
    const path = `M${x1_prime},${y1_prime} C${cx},${y1_prime} ${cx},${y2_prime} ${x2_prime},${y2_prime}`

    return path
  }

export const createEdgePath2 =
  (nodeWidth: number, nodeHeight: number) =>
  (x1: number, y1: number, x2: number, y2: number, points: Position[]) => {
    // translate edge ends to the centers of the nodes
    const x1_t = x1 + nodeWidth / 2
    const y1_t = y1 + nodeHeight / 2
    const x2_t = x2 + nodeWidth / 2
    const y2_t = y2 + nodeHeight / 2

    // shrink the edge in the x-axis
    const x1_prime = x1_t + nodeWidth / 2
    const y1_prime = y1_t
    const x2_prime = x2_t - nodeWidth / 2
    const y2_prime = y2_t

    // scale factor
    const a = 1 - nodeWidth / (x2_t - x1_t)

    const curve = points.reverse().reduce((acc, { x, y }) => {
      // translate control points the same way as the edge ends
      const x_t = x + nodeWidth / 2
      const y_t = y + nodeHeight / 2

      const y_prime = y_t
      const x_prime = x2_prime - a * (x2_t - x_t)

      const newAcc = `${acc}${x_prime.toFixed()},${y_prime.toFixed()} `
      return newAcc
    }, '')
    const path = `M${x1_prime},${y1_prime} C${curve}${x2_prime},${y2_prime} ${x2_prime},${y2_prime}`

    return path
  }

// tmp
export const transformControlPoint = ({
  x,
  y,
  x1,
  x2,
  nodeWidth,
  nodeHeight,
}: {
  x: number
  y: number
  x1: number
  x2: number
  nodeWidth: number
  nodeHeight: number
}): { x: number; y: number } => {
  const x1_t = x1 + nodeWidth / 2
  const x2_t = x2 + nodeWidth / 2
  const a = 1 - nodeWidth / (x2_t - x1_t)

  const x2_prime = x2_t - nodeWidth / 2

  const x_t = x + nodeWidth / 2
  const y_t = y + nodeHeight / 2

  const x_prime = x2_prime - a * (x2_t - x_t)
  const y_prime = y_t
  return { x: x_prime, y: y_prime }
}
