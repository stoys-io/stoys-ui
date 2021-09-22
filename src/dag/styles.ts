import styled from '@emotion/styled'
import { NODE_HEIGHT, NODE_WIDTH, NODE_HEIGHT2, NODE_WIDTH2 } from './constants'

import Select from 'antd/lib/select'
import Input from 'antd/lib/input'
const { Search } = Input

export const NodeBody = styled.div<{ highlight: boolean; expand: boolean }>`
  height: ${props => (props.expand ? NODE_HEIGHT2 : NODE_HEIGHT)}px;
  width: ${props => (props.expand ? NODE_WIDTH2 : NODE_WIDTH)}px;

  border: 2px solid ${props => (props.highlight ? 'green' : 'magenta')};
  border-radius: 5px;

  display: flex;
  flex-direction: column;
  align-items: center;
`

export const NodeToolbar = styled.div`
  display: flex;
`

export const Wrap = styled.div`
  background: transparent;
  width: 300px;
  height: 200px;
  border: 2px dotted cyan;
`

export const Container = styled.div`
  display: flex;
  justify-content: flex-start;
`

export const Content = styled.div`
  flex: 1;
`

// Sidebar
export const MenuTitle = styled.h4`
  margin-top: 20px;
`

export const SidebarContentWrapper = styled.div`
  padding: 20px 10px 10px 10px;
  background-color: #f4f2f4;
  position: relative;
  z-index: 3;
`
export const SelectVersion = styled(Select)`
  width: 100%;
`

export const SidebarWrapper = styled.div`
  width: 230px;
  height: 100vh;
  background-color: #f4f2f4;
`
export const NodeSearch = styled(Search)<{ error: string }>`
  .ant-input-search-button,
  .ant-input-affix-wrapper,
  .ant-input-affix-wrapper:hover {
    border-color: ${props => (props.error ? 'red' : '')};
  }
`
