import React, { ReactNode } from 'react'
import createContext from 'zustand/context'
import { createStore } from './store'
import { GraphStore } from './model'

const { Provider, useStore } = createContext<GraphStore>()
export const StoreProvider = ({ children }: Props) => {
  return <Provider createStore={createStore}>{children}</Provider>
}

interface Props {
  children: ReactNode
}

export const useGraphStore = useStore
export const useGraphDispatch = () => useStore(state => state.dispatch)
