import React from 'react'
import RiseOutlined from '@ant-design/icons/RiseOutlined'

import { ReactComponent as AxesIcon } from '../icons/axes.svg'
import HeaderCheckbox from './HeaderCheckbox'
import { CheckedRowsContext } from '../checkedRowsContext'
import { ChartTableHeaderProps } from '../model'
import { FlexWrapper } from '../styles'

const ChartTableHeader = ({
  logarithmicScale,
  children,
  axisOptions,
}: ChartTableHeaderProps): JSX.Element => {
  if (!logarithmicScale.isCheckboxShown && !axisOptions.isCheckboxShown) {
    return children
  }

  return (
    <CheckedRowsContext.Consumer>
      {({ checkedLogRows, checkedAxisRows, checkedTableRows, dataLength }) => (
        <FlexWrapper className="chart-wrapper">
          {children}
          {checkedTableRows.length === dataLength ? null : (
            <span>
              {logarithmicScale.isCheckboxShown ? (
                <HeaderCheckbox
                  isPartiallyChecked={
                    checkedLogRows.length !== 0 && checkedLogRows.length !== dataLength
                  }
                  setChecked={logarithmicScale.setChecked}
                  isChecked={checkedLogRows.length === dataLength}
                  title={<RiseOutlined />}
                />
              ) : null}
              {axisOptions.isCheckboxShown ? (
                <HeaderCheckbox
                  isPartiallyChecked={
                    checkedAxisRows.length !== 0 && checkedAxisRows.length !== dataLength
                  }
                  setChecked={axisOptions.setChecked}
                  isChecked={checkedAxisRows.length === dataLength}
                  title={<AxesIcon width="1em" height="1em" />}
                />
              ) : null}
            </span>
          )}
        </FlexWrapper>
      )}
    </CheckedRowsContext.Consumer>
  )
}

export default ChartTableHeader
