import numbro from 'numbro'

export const formatPercentage = (value: number) =>
  value === 0
    ? '0 %'
    : value * 100 < 0.01 // less than 0.01 %
      ? '< 0.01 %'
      : numbro(value).format({
        output: 'percent',
        mantissa: 2,
        spaceSeparated: true,
      })
