import React, { useCallback } from 'react'
import Tooltip from 'antd/lib/tooltip'
import ShrinkOutlined from '@ant-design/icons/ShrinkOutlined'
import ArrowsAltOutlined from '@ant-design/icons/ArrowsAltOutlined'
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined'

import { FailtureRules, RulesTableSwitchersWrapper, IconButton } from '../styles'
import { RulesTableSwitchersProps } from '../model'

const RulesTableSwitchers = ({
  mode,
  setMode,
  isCheckedFailtureRules,
  setCheckedFailtureRules,
}: RulesTableSwitchersProps): JSX.Element => {
  const onClick = useCallback(
    e => {
      setCheckedFailtureRules(!isCheckedFailtureRules)
    },
    [setCheckedFailtureRules, isCheckedFailtureRules]
  )

  return (
    <RulesTableSwitchersWrapper>
      <FailtureRules>
        <Tooltip title="Show only failed rules">
          <ExclamationCircleOutlined
            style={{ color: isCheckedFailtureRules ? '#000' : '#d3d3d3' }}
            onClick={onClick}
          />
        </Tooltip>
      </FailtureRules>
      |
      {mode === 'row' ? (
        <IconButton
          role="button"
          onClick={() => setMode('column')}
          data-testid="expand-rules-table-btn"
        >
          <Tooltip title="Expand">
            <ArrowsAltOutlined />
          </Tooltip>
        </IconButton>
      ) : (
        <IconButton
          role="button"
          onClick={() => setMode('row')}
          data-testid="shrink-rules-table-btn"
        >
          <Tooltip title="Show Less">
            <ShrinkOutlined />
          </Tooltip>
        </IconButton>
      )}
    </RulesTableSwitchersWrapper>
  )
}

export default RulesTableSwitchers
