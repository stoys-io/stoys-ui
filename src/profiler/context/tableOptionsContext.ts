import { createContext } from 'react'

import { TableOptions } from '../model'

function initFunc() {
  console.log('Initilization...')
}

export const TableOptionsContext = createContext<TableOptions>({
  setChecked: initFunc,
  isCheckboxShown: false,
  isUsedByDefault: false,
})
