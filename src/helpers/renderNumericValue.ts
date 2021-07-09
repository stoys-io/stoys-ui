import numbro from 'numbro'

export const renderNumericValue =
  (mantissa = 0, average = false) =>
  (value: string | number) =>
    numbro(value).format({
      mantissa,
      average,
      thousandSeparated: true,
      trimMantissa: true,
    })
