import { HydratedDataItem, HygratePmfPlotDataItem } from '../model'

export function hygratePmfPlotData(
  data?: Array<HydratedDataItem>
): Array<HygratePmfPlotDataItem> | null {
  if (!data) {
    return null
  }

  return data.map(({ pmf, parent, color, items, type }, index: number) => {
    return {
      name: `${parent}-${index}`,
      parent,
      pmf,
      items,
      color,
      type,
    }
  })
}
