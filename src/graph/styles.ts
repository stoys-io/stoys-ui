import styled from '@emotion/styled'
import Drawer from 'antd/lib/drawer'
import MenuOutlined from '@ant-design/icons/MenuOutlined'
import Select from 'antd/lib/select'
import Input from 'antd/lib/input'
const { Search } = Input

import List from 'antd/lib/list'

import Card from 'antd/lib/card'
import { NODE_HEIGHT, NODE_HEIGHT2, NODE_WIDTH, NODE_WIDTH2 } from './constants'

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

export const GraphContainer = styled.div`
  .ant-drawer-top.ant-drawer-open,
  .ant-drawer-bottom.ant-drawer-open {
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
  .ant-input-search-button,
  .ant-input-affix-wrapper,
  .ant-input-affix-wrapper:hover {
    border-color: ${props => (props.error ? 'red' : '')};
  }
`

export const ScrollCard = styled(Card)<{ expand?: boolean; highlight: boolean }>`
  width: ${props => (props.expand ? NODE_WIDTH2 : NODE_WIDTH)}px;
  height: ${props => (props.expand ? NODE_HEIGHT2 : NODE_HEIGHT)}px;
  border: 2px solid ${props => (props.highlight ? 'blue' : 'grey')};
  border-radius: 3px;
  cursor: pointer;

  // enables scroll
  display: flex;
  flex-direction: column;

  .ant-card-head:hover {
    color: blue;
  }

  .ant-card-body {
    flex: 1;
    overflow-y: scroll;

    padding: 0 12px; // this is to fit the list
  }

  .ant-list-item {
    padding: 0;
  }
`
