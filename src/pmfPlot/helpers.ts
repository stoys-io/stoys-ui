export const COUNT_INDEX = 2

export function transformSecondsToDate(item: string | number, type: string | undefined) {
  const value = +item * 1000

  if (isNaN(value)) {
    return item
  }

  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    ...(type !== 'date' ? { hour: 'numeric', minute: 'numeric', second: 'numeric' } : {}),
  })
}

export const renderItem = (isLogScale: boolean) => (params: any, api: any) => {
  const yValue = api.value(2)
  const start = api.coord([api.value(0), yValue])
  const end = api.coord([api.value(0), +isLogScale])
  const size = api.size([api.value(1) - api.value(0), yValue])
  const style = api.style()

  return {
    type: 'rect',
    shape: {
      x: start[0],
      y: start[1],
      width: size[0],
      height: end[1] - start[1],
    },
    style: style,
  }
}

export const removeZeroData = (enabledLogScale = false) => (pmfPlotData: Array<number>): boolean =>
  enabledLogScale && pmfPlotData[COUNT_INDEX] === 0 ? false : true
