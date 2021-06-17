import { PmfPlotItem } from '../profiler/model'

export interface PmfPlotProps {
  data: Array<PmfPlotItem> | Array<Array<PmfPlotItem>>
  dataType?: string
  showLogScale?: boolean
  showAxis?: boolean
  height?: number | string
  width?: number | string
  color?: string | Array<string>
}
