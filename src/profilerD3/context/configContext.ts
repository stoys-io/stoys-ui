import { createContext } from 'react'

import { ConfigProps } from '../model'

export const ConfigContext = createContext<{
  smallSize?: boolean
  showChartTableSwitcher?: boolean
  chartTableChecked?: boolean
  setChartTableChecked?: (isChecked: boolean) => void
  showLogarithmicSwitcher?: boolean
  setLogChecked?: (isChecked: boolean) => void
  showAxesSwitcher?: boolean
  setAxesChecked?: (isChecked: boolean) => void
}>({})
