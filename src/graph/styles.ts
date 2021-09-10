import styled from '@emotion/styled'
import Drawer from 'antd/lib/drawer'
import MenuOutlined from '@ant-design/icons/MenuOutlined'
import Select from 'antd/lib/select'
import Input from 'antd/lib/input'
const { Search } = Input

export const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: relative;
`

export const SidebarWrapper = styled.div<{ drawerHeight: number }>`
  height: ${props => `calc(100vh - ${props.drawerHeight}px)`};
  width: 250px;
  background-color: #f4f2f4;
  overflow-y: auto;
`

export const SidebarContentWrapper = styled.div`
  padding: 20px 10px 10px 10px;
  background-color: #f4f2f4;
  position: relative;
  z-index: 3;
`

export const UnderMiniMapBackground = styled.div`
  width: 100%;
  height: 200px;
  background-color: transparent;
`

export const GraphContainer = styled.div`
  width: calc(100% - 250px);
  .minimap {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #f4f2f4;
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

export const MenuTitle = styled.h4`
  margin-top: 20px;
`

export const SelectVersion = styled(Select)`
  width: 100%;
`

export const NodeSearch = styled(Search)<{ error: string }>`
  .ant-input-search-button, .ant-input-affix-wrapper, .ant-input-affix-wrapper:hover {
    border-color: ${props => props.error ? 'red' : ''};
  }
`
