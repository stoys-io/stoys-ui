import * as d3ScaleChromatic from 'd3-scale-chromatic'
import { Highlight, ChromaticScale } from './model'

export const fromColorPallete =
  (maxRank: number, highlight: Highlight, chromaticScale: ChromaticScale) => (rank: number) => {
    let gradient
    if (chromaticScale === 'interpolateInferno') {
      gradient =
        highlight === 'nearest'
          ? [0.25, 0.75]
          : highlight === 'children'
          ? getFlatGradient(0.5, 1, maxRank)
          : getFlatGradient(0, 0.5, maxRank).reverse()
    } else {
      gradient =
        highlight === 'nearest'
          ? getGradientNearest()
          : highlight === 'children'
          ? getFlatGradient(0.75, 1, maxRank)
          : getFlatGradient(0, 0.25, maxRank).reverse()
    }

    return getChromaticColor(gradient[rank - 1], chromaticScale)
  }

const getGradientNearest = (): number[] => {
  const child = 0.25
  const parent = 0.75

  return [child, parent]
}

const getFlatGradient = (low: number, high: number, steps: number): number[] => {
  const step = (high - low) / (steps - 1)
  const gradient = Array.from({ length: steps }, (_, i) => i * step + low)

  return gradient
}

const getChromaticColor = (t: number, chromaticScale: ChromaticScale) => {
  const scale = d3ScaleChromatic[chromaticScale]
  return scale(t)
}
