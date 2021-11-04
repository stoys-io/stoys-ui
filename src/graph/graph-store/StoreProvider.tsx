import React, { ReactNode } from 'react'
import createContext from 'zustand/context'
import { createStore } from './store'
import { GraphStore } from './model'

const { Provider, useStore } = createContext<GraphStore>()
export const StoreProvider = ({ children }: { children: ReactNode }) => {
  return <Provider createStore={createStore}>{children}</Provider>
}

export const useGraphStore = useStore
