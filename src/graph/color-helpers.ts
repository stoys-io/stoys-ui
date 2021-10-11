import * as d3ScaleChromatic from 'd3-scale-chromatic'
import { Highlight, ChromaticScale } from './model'

export const fromColorPallete =
  (maxRank: number, highlight: Highlight, chromaticScale: ChromaticScale) => (rank: number) => {
    const gradient =
      highlight !== 'nearest' ? getGradient(maxRank, highlight) : getGradientNearest()

    return getChromaticColor(gradient[rank], chromaticScale)
  }

const getGradientNearest = (): DiscreteGradient => {
  const child = 0.2
  const parent = 0.75

  return {
    [-1]: child,
    1: parent,
  }
}

const getGradient = (maxRank: number, highlight: Highlight): DiscreteGradient => {
  let lowParam = 0
  let highParam = 0.25

  if (highlight === 'children') {
    lowParam = 0.5
    highParam = 0.95
  }

  let remainDiff = highParam - lowParam

  const depthGradientParams: DiscreteGradient = {}
  for (let i = 1; i < maxRank; i++) {
    if (i === 1) {
      depthGradientParams[i] = highlight === 'children' ? lowParam : highParam
    } else {
      depthGradientParams[i] =
        highlight === 'children'
          ? depthGradientParams[i - 1] + remainDiff / 2
          : depthGradientParams[i - 1] - remainDiff / 2
      remainDiff = remainDiff / 2
    }
  }

  depthGradientParams[maxRank] = highlight === 'children' ? highParam : lowParam

  return depthGradientParams
}

const getChromaticColor = (t: number, chromaticScale: ChromaticScale) => {
  const scale = d3ScaleChromatic[chromaticScale]
  return scale(t)
}

interface DiscreteGradient {
  [rank: number]: number
}
