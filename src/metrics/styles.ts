import styled from '@emotion/styled'
import Table from 'antd/lib/table'

function getPaddingForTableCell({ smallSize }: { smallSize: boolean }): string {
  return smallSize ? '2px' : '12px 8px'
}

export const StyledMetricTable = styled(Table)<{ smallSize: boolean }>`
  .ant-table-thead > tr > th {
    white-space: nowrap;
    padding: ${getPaddingForTableCell};
  }

  .ant-table-column-sorters {
    margin: 0;
    padding: 0;
    white-space: nowrap;
  }

  .ant-table-cell {
    position: relative;
    padding: ${getPaddingForTableCell};
  }

  td.aligned-right {
    text-align: right;
  }
`

export const UppercaseValue = styled.span`
  text-transform: uppercase;
`

export const ChangePercentValue = styled.div`
  position: relative;
  z-index: 1;
`

export const ThresholdViolatedWrapper = styled.div`
  background-color: #f16768;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`

export const TrendsWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  height: 20px;
  min-width: 50px;
`

export const BarWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: flex-end;
  cursor: pointer;
`

export const TrendBar = styled.div<{ height: number }>`
  background-color: #bfaa84;
  min-width: 12px;
  height: ${props => (props.height ? `${props.height}%` : 0)};
  margin-right: 4px;
`
