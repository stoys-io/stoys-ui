import styled from '@emotion/styled'
import Table from 'antd/lib/table'

export const StyledJoinStatistics = styled(Table)<{smallSize: boolean}>`
  margin-bottom: 20px;

  .ant-table-tbody {
    cursor: pointer;
  }

  .ant-table-row.selected-row {
    td {
      background-color: #e2e2e2;
    }
  }

  td.ant-table-cell {
    padding: ${(props) => props.smallSize ? '2px' : '16px'};
  }

  th.ant-table-cell {
    padding: ${(props) => props.smallSize ? '4px' : '16px'};
  }
`
