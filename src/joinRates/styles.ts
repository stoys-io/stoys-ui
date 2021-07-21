import styled from '@emotion/styled'
import Table from 'antd/lib/table'

export const StyledJoinStatistics = styled(Table)`
  margin-bottom: 20px;

  .ant-table-tbody {
    cursor: pointer;
  }

  .ant-table-row.selected-row {
    td {
      background-color: #e2e2e2;
    }
  }
`
