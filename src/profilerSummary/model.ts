import { Column } from '../profiler/model'

export interface ProfilerSummaryProps {
  data: Column
  config?: { rows?: number; height?: string | number }
}
