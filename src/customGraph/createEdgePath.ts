export const createEdgePath =
  (nodeWidth: number, nodeHeight: number) => (x1: number, y1: number, x2: number, y2: number) =>
    getPath({
      x1: x1 + nodeWidth,
      y1: y1 + nodeHeight / 2,
      x2,
      y2: y2 + nodeHeight / 2,
    })

const getPath = ({ x1, y1, x2, y2 }: Path): string => {
  const cx = x1 + (x2 - x1) / 2
  const path = `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`

  return path
}

interface Path {
  x1: number
  y1: number
  x2: number
  y2: number
}
