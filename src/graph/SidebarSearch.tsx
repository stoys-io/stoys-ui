import React, { useState } from 'react'

import { NodeSearch } from './styles'

const SidebarSearch = ({ onSearch }: Props) => {
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchError, setSearchError] = useState<boolean>(false)

  return (
    <NodeSearch
      error={searchError ? 'true' : ''}
      placeholder="Search node"
      allowClear
      value={searchValue}
      onChange={e => setSearchValue(e.target.value)}
      onSearch={val => onSearch({ val, err: searchError, onError: setSearchError })}
    />
  )
}

export default SidebarSearch

interface Props {
  onSearch: OnSearch
}

export interface SearchArgs {
  val: string
  err: boolean
  onError: (err: boolean) => void
}

export type OnSearch = (args: SearchArgs) => void
