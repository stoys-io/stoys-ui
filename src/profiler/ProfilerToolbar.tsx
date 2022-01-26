import React, { useCallback, useState } from 'react'
import JsonDrawer from './components/JsonDrawer'

import TableSettings from './components/TableSettings'
import { ProfilerToolbarProps } from './model'

const ProfilerToolbar = (props: ProfilerToolbarProps) => {
  const { datasets, config } = props
  const {
    showOrientSwitcher = true,
    showJsonSwitcher = true,
    jsonChecked,
    onJsonChange,
    showNormalizeSwitcher = true,
    showSearch = true,
    isVertical,
    setIsVerticalView,
    onSearch,
    isNormalizeChecked,
    normalizeChange,
  } = config

  const [isJsonShown, setJsonShown] = useState<boolean>(!!jsonChecked)

  const _setJsonShown = useCallback(() => {
    setJsonShown((prevState: boolean) => {
      onJsonChange?.(!prevState)

      return !prevState
    })
  }, [config])

  return (
    <>
      <TableSettings
        isModeSwitcherShown={showOrientSwitcher}
        isModeSwitcherChecked={!!isVertical}
        onModeChange={setIsVerticalView}
        isSearchShown={!!showSearch}
        onSearchChangeHandler={onSearch}
        isJsonSwitcherShown={showJsonSwitcher}
        isJsonSwitcherChecked={isJsonShown}
        onJsonChange={_setJsonShown}
        isNormalizeSwitcherShown={showNormalizeSwitcher}
        isNormalizeSwitcherChecked={!!isNormalizeChecked}
        onNormalizeChange={normalizeChange}
      />
      {isJsonShown ? (
        <JsonDrawer visible={isJsonShown} onClose={_setJsonShown} datasets={datasets} />
      ) : null}
    </>
  )
}

export default ProfilerToolbar
