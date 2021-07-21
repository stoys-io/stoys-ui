import styled from '@emotion/styled'
import css from '@emotion/css'
import Radio from 'antd/lib/radio'
import AntdTable from 'antd/lib/table'
import Empty from 'antd/lib/empty'

import {
  MIN_CHART_CELL_HEIGHT,
  MIN_TABLE_ROW_HEIGHT,
  TABLE_ROW_HEIGHT,
  COLUMN_CHART_WIDTH,
  SMALL_COLUMN_CHART_WIDTH,
} from './constants'

export const CellWrapper = styled.div`
  padding: 12px 8px;
`

const smallTableStyles = (props: { smallSize: boolean }) =>
  props.smallSize
    ? css`
        table {
          .ant-table-thead {
            > tr {
              > th {
                padding-top: 4px;
                padding-bottom: 4px;
              }
            }
          }

          tr.ant-table-row-level-0 {
            > td.ant-table-cell-with-append {
              > div {
                padding-top: 2px;
                padding-bottom: 2px;
              }
            }
          }

          .table-flex-row {
            > span {
              width: ${COLUMN_CHART_WIDTH}px;

              @media screen and (max-width: 1024px) {
                width: ${SMALL_COLUMN_CHART_WIDTH}px;
              }

              .ant-radio-group {
                margin-right: 10px;

                > .ant-radio-button-wrapper {
                  height: 25px;
                  line-height: 25px;
                  font-size: 18px;
                }
              }
            }
          }
        }
      `
    : ''

export const TableWrapper = styled.div<{ smallSize: boolean }>`
  table {
    margin-bottom: 0;

    tr {
      padding: 0;

      td:first-of-type {
        text-align: left;
      }
    }

    th.chart-cell {
      position: relative;
      width: ${COLUMN_CHART_WIDTH}px;
      padding: 4px 8px 4px 0px;

      @media screen and (max-width: 1024px) {
        width: ${SMALL_COLUMN_CHART_WIDTH}px;
      }
    }

    .toolbox-icon {
      font-size: 17px;
    }
  }

  .ant-table-tbody td.ant-table-cell {
    padding: 0;
  }

  tr.ant-table-row-level-0 {
    &:hover > td.ant-table-cell-with-append {
      background-color: #e8e8e8;
    }

    td.ant-table-cell-with-append {
      transition: none;
      background-color: #e8e8e8;

      > div {
        padding-top: 8px;
        padding-bottom: 8px;
        text-align: left;
      }
    }
  }

  .ant-table-row-level-1,
  .horizontal-row {
    height: ${props => (props.smallSize ? MIN_TABLE_ROW_HEIGHT : TABLE_ROW_HEIGHT)}px;

    &:hover td.chart-cell {
      background-color: transparent;
    }

    > td.ant-table-cell-with-append {
      padding-left: 10px;
    }

    td.ant-table-cell {
      padding-left: 8px;
      padding-right: 8px;
      max-width: 120px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    td.chart-cell {
      padding: 0;
    }
  }

  .horizontal-row {
    > td {
      min-width: 100px;
      white-space: nowrap;

      &:first-of-type {
        min-width: 220px;

        .chart-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          padding: 16px 8px;

          .ant-radio-group {
            margin-bottom: 8px;
          }

          > span {
            display: flex;
            flex-direction: column;
          }
        }
      }

      &:not(:first-of-type) {
        > span:not(.color-block) {
          padding: 8px 0px;
        }
      }
    }

    &:last-of-type {
      height: 220px;

      .ant-empty {
        height: ${MIN_CHART_CELL_HEIGHT}px;
      }
    }

    .color-block {
      width: 100%;
      height: 10px;
    }
  }

  th.ant-table-cell {
    white-space: nowrap;
  }

  th.chart-cell {
    position: relative;
    width: ${COLUMN_CHART_WIDTH}px;
    padding: 4px;

    @media screen and (max-width: 1024px) {
      width: ${SMALL_COLUMN_CHART_WIDTH}px;
    }
  }

  ${smallTableStyles};
`

export const FlexWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`

export const TableSubheader = styled(CellWrapper)`
  width: 100%;
  height: 100%;
`

export const ColorBlock = styled.span`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 10px;
  background-color: ${props => props.color};
`

export const CheckboxWrapper = styled.span`
  font-size: 0.9em;
  font-weight: normal;
`

export const NoData = styled.h3`
  width: 100%;
  font-size: 30px;
  text-align: center;
  color: #e8e8e8;
`

export const StyledCheckbox = styled.span<{ isPartiallyChecked: boolean }>`
  .ant-checkbox:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    display: ${({ isPartiallyChecked }) => (isPartiallyChecked ? 'block' : 'none')};
    width: 8px;
    height: 8px;
    background-color: #1890ff;
    z-index: 2;
    transform: translate(-50%, -50%);
  }
`

export const RadioButton = styled(Radio.Button)`
  font-size: 24px;
`

export const ChartTable = styled(AntdTable)<{ height: number }>`
  height: ${({ height }) => `${height}px`};

  .ant-spin-nested-loading > .ant-spin-container > .ant-table-fixed-header.ant-table {
    margin: 0;
  }

  th.ant-table-cell {
    padding-top: 4px;
    padding-bottom: 4px;
  }
`

export const ModeCheckboxWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const ModeIconWrapper = styled.div<{ checked: boolean }>`
  font-size: 20px;
  color: ${props => (props.checked ? '#1890ff' : 'inherit')};
  padding: 4px;
  transform: rotate(${props => (props.checked ? '90' : '0')}deg)
    scaleY(${props => (props.checked ? '-1' : '1')});
  cursor: pointer;
`

export const StyledEmpty = styled(Empty)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0;
`

export const ToolboxWrapper = styled.div`
  display: flex;
  justify-content: flex-end;

  > .toolbox-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2px;
    border: 1px solid transparent;
    border-radius: 100%;
    padding: 3px;
    cursor: pointer;

    &.active {
      border-color: #1890ff;
      color: #fff;
      background-color: #1890ff;

      > svg {
        fill: #fff;
      }
    }

    &.partially-active {
      color: #1890ff;

      > svg {
        fill: #1890ff;
      }
    }

    &.disabled {
      color: #d9d9d9;
      cursor: not-allowed;

      &:hover {
        border-color: transparent;
      }

      > svg {
        fill: #d9d9d9;
      }
    }
  }
`

export const SvgWrapper = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`
