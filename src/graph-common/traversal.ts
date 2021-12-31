const traverseHelper = <T>(
  graph: Traversable<T>,
  head: string,
  queue: string[],
  visited: Traversable<T>
): Traversable<T> => {
  if (!queue.length) {
    return visited
  }

  const neighbors = graph[head]?.dependencies?.filter(dep => visited[dep] === undefined) ?? []
  const newQueue = [...queue].slice(1).concat(neighbors)
  const newHead = newQueue[0]
  const newVisited = !newHead ? visited : { ...visited, [newHead]: graph[newHead] }

  return traverseHelper(graph, newHead, newQueue, newVisited)
}

export const traverseGraph = <T>(graph: Traversable<T>, nodeId: string): Traversable<T> => {
  const visitedColumns = traverseHelper(graph, nodeId, [nodeId], { [nodeId]: graph[nodeId] })
  return visitedColumns
}

export interface Traversable<T = {}> {
  [key: string]: T & { dependencies: string[] }
}
