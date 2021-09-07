import { EChartsOption } from 'echarts-for-react/lib/types'
import { PmfPlotItem } from '../profiler/model'

export interface PmfPlotProps {
  data: Array<PmfPlotItem> | Array<Array<PmfPlotItem>>
  dataType?: string
  showLogScale?: boolean
  showAxes?: boolean
  height?: number | string
  width?: number | string
  color?: string | Array<string>
  plotOptions?: EChartsOption
}
