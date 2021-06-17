import { createContext } from 'react'

import { CheckedRowsContextProps } from './model'

function initFunc() {
  console.log('Initilization...')
}

export const CheckedRowsContext = createContext<CheckedRowsContextProps>({
  checkedLogRows: [],
  setCheckedLogRows: initFunc,
  checkedAxisRows: [],
  setCheckedAxisRows: initFunc,
  checkedTableRows: [],
  setCheckedTableRows: initFunc,
  dataLength: 0,
})
