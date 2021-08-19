import styled from '@emotion/styled'
import { Drawer } from 'antd'

export const GraphContainer = styled.div`
  .ant-drawer-top.ant-drawer-open, .ant-drawer-bottom.ant-drawer-open {
    height: unset;
  }
`

export const StyledDrawer = styled(Drawer)`
  .ant-drawer-body {
    padding: 10px 16px;
  }
`
