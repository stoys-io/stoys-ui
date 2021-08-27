import styled from '@emotion/styled'
import { Drawer } from 'antd'
import MenuOutlined from '@ant-design/icons/MenuOutlined'

export const GraphContainer = styled.div`
  position: relative;
  .minimap {
    position: absolute;
    top: 0;
    background-color: #ffffff;
  }
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
    .ant-tabs-content {
      position: relative;
    }
  }
  .ant-drawer-content {
    overflow: unset;
  }
`

export const DrawerNodeLabel = styled.div`
  position: absolute;
  top: -49px;
  right: 45px;
  font-weight: bold;
`

export const ResizeIcon = styled(MenuOutlined)`
  position: absolute;
  top: -5px;
  left: calc(50% - 6px);
  font-size: 12px;
  background-color: #ffffff;
  cursor: pointer;
  z-index: 5;
`

export const ResizeArea = styled.div`
  height: 15px;
  width: 100%;
  position: absolute;
  top: -5px;
  cursor: row-resize;
  z-index: 10;
`
