import React from 'react'

import JsonIcon from '../icons/Json'
import { SwitcherProps } from '../model'
import { JsonIconWrapper } from '../styles'

const JsonSwitcher = ({ checked, onChange }: SwitcherProps): JSX.Element => {
  return (
    <JsonIconWrapper checked={checked} onClick={onChange}>
      <JsonIcon width="1em" height="1em" />
    </JsonIconWrapper>
  )
}

export default JsonSwitcher
