import styled from '@emotion/styled'
import SearchOutlined from '@ant-design/icons/SearchOutlined'

export const TableTitleWrapper = styled.div`
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 32px;
`

export const TableTitle = styled.h3`
  .data-quality-checks & {
    margin: 0;
    font-weight: bold;
    font-size: 16px;
  }
`

export const SwitchModeButton = styled.div`
  cursor: pointer;
  font-weight: normal;
  display: flex;
  align-items: center;
  margin-left: 5px;
`

export const TablesWrapper = styled.div<{ mode: string }>`
  display: flex;
  flex-direction: ${props => props.mode};

  .ant-table-row {
    cursor: pointer;
  }

  th {
    &.ant-table-column-has-sorters {
      padding: 0;
      :before {
        display: none;
      }
    }

    .ant-table-column-sorters {
      padding: 0;
      margin: 8px 0;
    }
  }

  .ant-table-column-sorter {
    min-width: 14px;
  }
`

function getTableHeaderHeight({ smallSize }: { smallSize: boolean }): string {
  return smallSize ? '67px' : '77px'
}

export const RulesTableWrapper = styled.div<{ isNarrowMode: boolean; smallSize: boolean }>`
  flex: 1;
  margin-bottom: 30px;
  margin-right: ${props => (props.isNarrowMode ? '30px' : 0)};
  max-width: ${props => (props.isNarrowMode ? '350px' : 'unset')};
  tr.ant-table-row > td.ant-table-cell {
    padding: 0px;
    & > span {
      display: block;
      padding: ${({ smallSize }) => (smallSize ? '7px' : '12px 8px')};
    }
  }

  .ant-table-thead > tr > th {
    height: ${props => (props.isNarrowMode ? getTableHeaderHeight(props) : 'unset')};
  }

  .ant-table-thead th.ant-table-column-has-sorters:hover .ant-table-filter-trigger-container {
    background-color: transparent;
  }
  .ant-table-filter-trigger-container-open {
    background-color: transparent;
  }
  .ant-table-filter-trigger-container:hover {
    background-color: transparent;
  }
`

function getPaddingForSampleTableCell({ smallSize }: { smallSize: boolean }): string {
  return smallSize ? '2px' : '8px'
}

export const SampleTableWrapper = styled.div<{ heightenedCell?: boolean; smallSize: boolean }>`
  flex-grow: 3;
  min-width: 1px;
  width: 100%;

  .ant-table-tbody > tr > td.ant-table-cell {
    padding: 0;
    overflow: inherit;

    > div {
      display: flex;
      align-items: center;
      height: ${props => (props.heightenedCell ? '66px' : 'unset')};
    }

    span.ant-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 5;
      overflow: initial;
      pointer-events: none;
    }
  }

  .ant-table-thead > tr > th {
    padding-left: ${getPaddingForSampleTableCell};
    padding-right: ${getPaddingForSampleTableCell};
    height: ${getTableHeaderHeight};
  }

  .ant-pagination-options-size-changer.ant-select {
    width: auto !important;
  }

  .ant-table-cell-ellipsis {
    white-space: initial;
  }

  .ant-table-column-sorters-with-tooltip {
    text-align: left;
  }

  .virtual-table-cell {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
  }
`

export const SampleHeaderTextWrapper = styled.span`
  max-width: 262px;
  overflow: hidden;
  display: inline-block;
`

export const HeaderErrorsQuantity = styled.span`
  white-space: nowrap;
`

export const ErrorWrapper = styled.div<{ hasError?: boolean }>`
  border-right: ${props => `${props.hasError ? '1px solid #e8e8e8' : 'unset'}`};
  background-color: ${props => `${props.hasError ? '#F16768' : 'unset'}`};
  height: 100%;
  min-width: 60px;
  width: 100%;
  max-width: 600px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const SampleCellWrapper = styled.div`
  width: 100%;
  height: 100%;
`

export const Cell = styled.span`
  display: inline-flex;
  align-items: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  height: 100%;
  width: 100%;
  padding-left: 2px;
`

export const TooltipWrapper = styled.div`
  &:last-of-type {
    p {
      margin-bottom: 0;
    }
  }
`

export const TooltipRuleName = styled.div`
  font-weight: bold;
`

export const RuleSearchIcon = styled(SearchOutlined)`
  svg {
    height: 15px;
    width: 15px;
  }
`

export const DescriptionCell = styled.span`
  padding-left: 10px;
`

export const RulesTableSwitchersWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

export const FailtureRules = styled.span`
  margin-right: 5px;
`
