import { createContext } from 'react'

export const ConfigContext = createContext<{
  smallSize?: boolean
  showChartTableSwitcher?: boolean
  setChartTableChecked?: (isChecked: boolean) => void
  showLogarithmicSwitcher?: boolean
  setLogChecked?: (isChecked: boolean) => void
  showAxesSwitcher?: boolean
  setAxesChecked?: (isChecked: boolean) => void
  showOrientSwitcher?: boolean
  isVertical?: boolean
  _setIsVerticalView: () => void
  showSearch?: boolean
  _onSearch: (search: string) => void
  showJsonSwitcher?: boolean
  isJsonShown?: boolean
  _setJsonShown: () => void
  showNormalizeSwitcher?: boolean
  isNormalizeChecked?: boolean
  _normalizeChange: () => void
  showProfilerToolbar?: boolean
}>({
  _setIsVerticalView: () => console.log('Initialization...'),
  _onSearch: () => console.log('Initialization...'),
  _setJsonShown: () => console.log('Initialization...'),
  _normalizeChange: () => console.log('Initialization...'),
})
