import { createContext } from 'react'

import { ConfigProps } from '../model'

export const ConfigContext = createContext<ConfigProps & { setChartTableChecked?: any }>({})
