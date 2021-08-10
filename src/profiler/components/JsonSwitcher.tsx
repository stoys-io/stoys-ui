import React from 'react'

import JsonIcon from '../icons/Json'
import { JsonIconWrapper } from '../styles'

const JsonSwitcher = () => {
  return (
    <JsonIconWrapper checked>
      <JsonIcon width="1em" height="1em" />
    </JsonIconWrapper>
  )
}

export default JsonSwitcher
