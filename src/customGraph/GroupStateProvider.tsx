import React, { ReactNode } from 'react'
import create from 'zustand'
import createContext from 'zustand/context'
import { NodeGroups } from './types'

const { Provider, useStore } = createContext<GroupState>()
const GroupStateProvider = ({ initialGroups, children }: Props) => {
  const createStore = () =>
    create<GroupState>(set => ({
      groups: initialGroups,
      toggleGroup: (group: string) =>
        set(state => {
          const groupState = state.groups[group]
          return { groups: { ...state.groups, [group]: !groupState } }
        }),
    }))

  return <Provider createStore={createStore}>{children}</Provider>
}

export default GroupStateProvider
export interface Props {
  children: ReactNode
  initialGroups: NodeGroups
}
export { useStore }

interface GroupState {
  groups: NodeGroups
  toggleGroup: (_: string) => void
}
