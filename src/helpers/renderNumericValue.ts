import numbro from 'numbro'

export const renderNumericValue =
  (mantissa = 0, average = false, trimMantissa = true) =>
  (value: string | number) =>
    numbro(value).format({
      mantissa,
      average,
      trimMantissa,
      thousandSeparated: true,
    })
