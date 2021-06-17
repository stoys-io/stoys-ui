import get from 'lodash.get'

export const alignRight = 'right' as 'right'

export const alignLeft = 'left' as 'left'

export const alignCenter = 'center' as 'center'

export const defaultSort = (field: string) => (a: any, b: any) => {
  return get(a, field) > get(b, field) ? 1 : -1
}

export function getTextWidth(text: string): number {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  context!.font = '16px sans-serif'

  return context!.measureText(text).width
}
