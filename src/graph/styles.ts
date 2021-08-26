import styled from '@emotion/styled'
import { Drawer } from 'antd'

export const GraphContainer = styled.div`
  position: relative;
  .g6-tooltip {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 14px;
    color: #545454;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 4px;
    box-shadow: rgb(174, 174, 174) 0 0 10px;
  }
  .ant-drawer-top.ant-drawer-open, .ant-drawer-bottom.ant-drawer-open {
    height: unset;
  }
`

export const StyledDrawer = styled(Drawer)`
  .ant-drawer-body {
    padding: 10px 16px;
  }
`
