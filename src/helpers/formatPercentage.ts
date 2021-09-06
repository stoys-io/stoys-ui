import numbro from 'numbro'

export const formatPercentage = (value: number) =>
  value * 100 < 0.01
    ? '< 0.01 %'
    : numbro(value).format({
        output: 'percent',
        mantissa: 2,
        spaceSeparated: true,
      })
