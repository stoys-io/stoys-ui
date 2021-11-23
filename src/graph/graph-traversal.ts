import { Table } from './model'

const traverseHelper = (
  columnGraph: Traversable,
  head: string,
  queue: string[],
  visited: { [key: string]: boolean }
): string[] => {
  if (!queue.length) {
    return Object.keys(visited)
  }

  const neighbors = columnGraph[head]?.dependencies?.filter(dep => !visited[dep]) ?? []
  const newQueue = [...queue].slice(1).concat(neighbors)
  const newHead = newQueue[0]
  const newVisited = !newHead ? visited : { ...visited, [newHead]: true }

  return traverseHelper(columnGraph, newHead, newQueue, newVisited)
}

export const traverseColumnsChildren = (cId: string, tables: Table[]): ColumnAndTableIds => {
  const columnIndex: Traversable<ColumnExtended> = tables.reduce((acc, t) => {
    const cols = t.columns.reduce(
      (accCols, col) => ({
        ...accCols,
        [col.id]: { ...col, tableId: t.id },
      }),
      {}
    )

    return { ...acc, ...cols }
  }, {})

  const visitedColumns = traverseHelper(columnIndex, cId, [cId], { [cId]: true })
  const tableIds = visitedColumns.map(col => columnIndex[col].tableId)

  return {
    tableIds,
    columnIds: visitedColumns,
  }
}

export const traverseColumnsParents = (cId: string, tables: Table[]): ColumnAndTableIds => {
  const columnIndex: Traversable<ColumnExtended> = tables.reduce((acc, t) => {
    const cols = t.columns.reduce(
      (accCols, col) => ({
        ...accCols,
        [col.id]: { ...col, tableId: t.id },
      }),
      {}
    )

    return { ...acc, ...cols }
  }, {})

  const depsIndex = Object.entries(columnIndex).reduce((acc, [id, col]) => {
    if (!col.dependencies?.length) {
      return acc
    }

    col.dependencies.forEach((dep: string) => {
      if (!acc[dep]) {
        acc[dep] = { dependencies: [id] }
      }

      acc[dep].dependencies.push(id)
    })

    return acc
  }, {} as Traversable)

  const visitedColumns = traverseHelper(depsIndex, cId, [cId], { [cId]: true })
  const tableIds = visitedColumns.map(col => columnIndex[col].tableId)

  return {
    tableIds: tableIds,
    columnIds: visitedColumns,
  }
}

type ColumnExtended = {
  tableId: string
}

interface Traversable<T = {}> {
  [key: string]: T & { dependencies: string[] }
}

export interface ColumnAndTableIds {
  tableIds: Array<string>
  columnIds: Array<string>
}
