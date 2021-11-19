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
