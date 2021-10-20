import styled from '@emotion/styled'
import Drawer from 'antd/lib/drawer'

export const StyledDrawer = styled(Drawer)`
  .ant-drawer-body {
    padding-top: 0;
  }
`

export const SearchWrapper = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: row;
  padding-top: 24px;
  padding-bottom: 5px;
  background-color: #fff;
  z-index: 2;
`
