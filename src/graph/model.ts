export interface Node {
  id: string
  label: string
  comboId?: string
  violations: number
  partitions: number
}

export type Nodes = Array<Node>

export interface Edge {
  id: string
  source: string
  target: string
}

export type Edges = Array<Edge>

export interface Combo {
  id: string
  label: string
}

export type Combos = Array<Combo>

export type Badge = 'violations' | 'partitions'

export type Highlight = 'nearest' | 'parents' | 'children'

type D3Scale = 'interpolateBrBG' | 'interpolatePRGn' | 'interpolatePiYG' | 'interpolatePuOr' | 'interpolateRdBu'
  | 'interpolateRdGy' | 'interpolateRdYlBu' | 'interpolateRdYlGn' | 'interpolateSpectral' | 'interpolateBlues'
  | 'interpolateGreens' | 'interpolateGreys' | 'interpolateOranges' | 'interpolatePurples' | 'interpolateReds'
  | 'interpolateTurbo' | 'interpolateViridis' | 'interpolateInferno' | 'interpolateMagma' | 'interpolatePlasma'
  | 'interpolateCividis' | 'interpolateWarm' | 'interpolateCool' | 'interpolateRainbow' | 'interpolateSinebow'
  | 'interpolateCubehelixDefault' | 'interpolateBuGn' | 'interpolateBuPu' | 'interpolateGnBu' | 'interpolateOrRd'
  | 'interpolatePuBuGn' | 'interpolatePuBu' | 'interpolatePuRd' | 'interpolateRdPu' | 'interpolateYlGnBu'
  | 'interpolateYlGn' | 'interpolateYlOrBr' | 'interpolateYlOrRd'

export type ChromaticScale = D3Scale

export interface GraphProps {
  nodes: Nodes
  edges: Edges
  combos: Combos
  // You can use any color scheme from https://github.com/d3/d3-scale-chromatic#sequential-single-hue
  // Pass the name of the scheme as chromaticScale prop (ex. 'interpolateBlues', 'interpolateGreens', etc.)
  chromaticScale?: ChromaticScale
}
