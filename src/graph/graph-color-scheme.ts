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

const hyperbolicNearest = (n: number): number => {
  const low = 0.25
  const high = 0.75

  const colors: { [key: number]: number } = {
    [-1]: low,
    1: high,
  }

  return colors[n]
}

// |||-|-|--|----|-----------
const hyperbolicGradientLeft = (n: number): number => {
  const low = 0
  const high = 0.5
  const diff = high - low

  return low + diff / (n + 1)
}

// ------------|----|--|-|-|||
const hyperbolicGradientRight = (n: number): number => {
  const low = 0.5
  const high = 1
  const diff = high - low

  return low + diff * (1 - 1 / (n + 1))
}

const getChromaticColor = (t: number, chromaticScale: ChromaticScale) => {
  // t is [0, 1]
  const scale = d3ScaleChromatic[chromaticScale]

  return scale(t)
}
