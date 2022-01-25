import React, { useCallback } from 'react'
import Tooltip from 'antd/lib/tooltip'
import RiseOutlined from '@ant-design/icons/RiseOutlined'
import TableOutlined from '@ant-design/icons/lib/icons/TableOutlined'
import MenuOutlined from '@ant-design/icons/MenuOutlined'

import AxesIcon from '../icons/Axes'
import { SvgWrapper, ToolboxWrapper } from '../styles'
import { ToolboxProps } from '../model'
import { Maybe } from '../../model'

function getActiveClassName(isActive?: boolean): string {
  return isActive ? 'active' : ''
}

function getPartiallyActiveClassName(isActive?: boolean): string {
  return isActive ? 'partially-active' : ''
}

function getDisabledClassName(isActive?: boolean): string {
  return isActive ? 'disabled' : ''
}

const Toolbox = ({
  showTableChartSwitcher = true,
  showLogScale = true,
  showAxes = true,
  activeAxes,
  partiallyActiveAxes,
  activeLogScale,
  partiallyActiveLogScale,
  activeTable,
  partiallyActiveTable,
  disableLogScale,
  disableAxes,
  onAxesClickHandler,
  onLogScaleClickHandler,
  onTableClickHandler,
  isMenuShowed,
  setIsMenuShowed,
  activeMenu,
}: ToolboxProps): Maybe<JSX.Element> => {
  const _onAxesClickHandler = useCallback(() => {
    if (!disableLogScale) {
      onAxesClickHandler(!activeAxes)
    }
  }, [activeAxes, disableLogScale, onAxesClickHandler])

  const _onLogScaleClickHandler = useCallback(() => {
    if (!disableAxes) {
      onLogScaleClickHandler(!activeLogScale)
    }
  }, [activeLogScale, disableAxes, onLogScaleClickHandler])

  const _onTableClickHandler = useCallback(() => {
    onTableClickHandler(!activeTable)
  }, [activeTable, onTableClickHandler])

  const _menuHandler = useCallback(
    () => setIsMenuShowed?.(!activeMenu),
    [setIsMenuShowed, activeMenu]
  )

  if (!showTableChartSwitcher && !showLogScale && !showAxes) {
    return null
  }

  return (
    <ToolboxWrapper>
      {isMenuShowed ? (
        <Tooltip title="show menu">
          <MenuOutlined
            className={`toolbox-icon ${activeMenu ? 'active' : ''}`}
            onClick={_menuHandler}
          />
        </Tooltip>
      ) : null}
      {showTableChartSwitcher ? (
        <Tooltip title="switch to table view">
          <TableOutlined
            onClick={_onTableClickHandler}
            className={`toolbox-icon ${getActiveClassName(
              activeTable
            )} ${getPartiallyActiveClassName(partiallyActiveTable)}`}
            data-testid="table-view-btn"
          />
        </Tooltip>
      ) : null}
      {showLogScale ? (
        <Tooltip title="enable log scale">
          <RiseOutlined
            onClick={_onLogScaleClickHandler}
            className={`toolbox-icon ${getActiveClassName(activeLogScale)} ${getDisabledClassName(
              disableLogScale
            )} ${getPartiallyActiveClassName(partiallyActiveLogScale)}`}
            data-testid="log-btn"
          />
        </Tooltip>
      ) : null}
      {showAxes ? (
        <Tooltip title="enable axes">
          <SvgWrapper
            onClick={_onAxesClickHandler}
            className={`toolbox-icon ${getActiveClassName(activeAxes)} ${getDisabledClassName(
              disableAxes
            )} ${getPartiallyActiveClassName(partiallyActiveAxes)}`}
            data-testid="axes-btn"
          >
            <AxesIcon width="1em" height="1em" />
          </SvgWrapper>
        </Tooltip>
      ) : null}
    </ToolboxWrapper>
  )
}

export default Toolbox
