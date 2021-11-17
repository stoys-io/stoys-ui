import * as d3ScaleChromatic from 'd3-scale-chromatic'
import { Highlight, ChromaticScale } from './model'

export const colorScheme =
  (highlightMode: Highlight, chromaticScale: ChromaticScale) => (rank: number) => {
    const gradient =
      highlightMode === 'nearest'
        ? hyperbolicNearest
        : highlightMode === 'children'
        ? hyperbolicGradientRight
        : hyperbolicGradientLeft

    return getChromaticColor(gradient(rank), chromaticScale)
  }

const hyperbolicNearest = (n: number, low: number = 0.25, high: number = 0.75): number => {
  const colors: { [key: number]: number } = {
    [-1]: low,
    1: high,
  }

  return colors[n]
}

// |||-|-|--|----|-----------
export const hyperbolicGradientLeft = (n: number, low: number = 0, high: number = 0.5): number => {
  const diff = high - low
  return low + diff / (n + 1)
}

// ------------|----|--|-|-|||
export const hyperbolicGradientRight = (n: number, low: number = 0.5, high: number = 1): number => {
  const diff = high - low

  return low + diff * (1 - 1 / (n + 1))
}

export const shiftedFlatScale = (t: number, low: number = 0, high: number = 1) => {
  // t === 0 ; shiftedFlatScale => low
  // t === 1 ; shiftedFlatScale => high
  if (t === 0) {
    return 0
  }

  const diff = high - low

  return low + diff * t
}

export const getChromaticColor = (t: number, chromaticScale: ChromaticScale) => {
  // t is [0, 1]
  const scale = d3ScaleChromatic[chromaticScale]

  return scale(t)
}
