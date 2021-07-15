import React, { useCallback } from 'react'
import Tooltip from 'antd/lib/tooltip'
import RiseOutlined from '@ant-design/icons/RiseOutlined'
import TableOutlined from '@ant-design/icons/lib/icons/TableOutlined'
import BarChartOutlined from '@ant-design/icons/lib/icons/BarChartOutlined'

import { ReactComponent as AxesIcon } from '../icons/axes.svg'

import { SvgWrapper, ToolboxWrapper } from '../styles'
import { ToolboxProps } from '../model'

function getActiveClassName(isActive?: boolean): string {
  return isActive ? 'active' : ''
}
function getDisabledClassName(isActive?: boolean): string {
  return isActive ? 'disabled' : ''
}

const Toolbox = ({
  isTableChartSwitcherHidden,
  isLogScaleSwitcherHidden,
  isAxesSwitcherHidden,
  activeAxes,
  activeLogScale,
  activeTable,
  disableLogScale,
  disableAxes,
  onAxesClickHandler,
  onLogScaleClickHandler,
  onTableClickHandler,
}: ToolboxProps): JSX.Element | null => {
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
    if (!activeTable) {
      onTableClickHandler(true)
    }
  }, [activeTable, onTableClickHandler])

  const _onChartClickHandler = useCallback(() => {
    if (activeTable) {
      onTableClickHandler(false)
    }
  }, [activeTable, onTableClickHandler])

  if (isTableChartSwitcherHidden && isLogScaleSwitcherHidden && isAxesSwitcherHidden) {
    return null
  }

  return (
    <ToolboxWrapper>
      {isTableChartSwitcherHidden ? null : (
        <>
          <Tooltip title="show table">
            <TableOutlined
              onClick={_onTableClickHandler}
              className={`toolbox-icon ${getActiveClassName(activeTable)}`}
            />
          </Tooltip>
          <Tooltip title="show chart">
            <BarChartOutlined
              onClick={_onChartClickHandler}
              className={`toolbox-icon ${getActiveClassName(!activeTable)}`}
            />
          </Tooltip>
        </>
      )}
      {isLogScaleSwitcherHidden ? null : (
        <Tooltip title="enable log scale">
          <RiseOutlined
            onClick={_onLogScaleClickHandler}
            className={`toolbox-icon ${getActiveClassName(activeLogScale)} ${getDisabledClassName(
              disableLogScale
            )}`}
          />
        </Tooltip>
      )}
      {isAxesSwitcherHidden ? null : (
        <Tooltip title="enable axes">
          <SvgWrapper
            onClick={_onAxesClickHandler}
            className={`toolbox-icon ${getActiveClassName(activeAxes)} ${getDisabledClassName(
              disableAxes
            )}`}
          >
            <AxesIcon width="1em" height="1em" />
          </SvgWrapper>
        </Tooltip>
      )}
    </ToolboxWrapper>
  )
}

export default Toolbox
