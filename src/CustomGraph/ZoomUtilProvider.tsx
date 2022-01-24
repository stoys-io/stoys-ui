import { PanzoomObject } from '@panzoom/panzoom'
import React, { ReactNode } from 'react'
import create from 'zustand'
import createContext from 'zustand/context'
import { START_X, START_Y } from './constants'
import { NodeIndex } from './types'

const { Provider, useStore: useZoomUtilStore } = createContext<ZoomUtilStore>()
const ZoomUtilProvider = ({ children }: Props) => {
  const createStore = () =>
    create<ZoomUtilStore>((set, get) => ({
      panzoom: undefined,
      nodeIndex: {},
      initZoomUtil: ({ panzoom, nodeIndex }) => set({ panzoom, nodeIndex }),
      jump: (nodeId: string) => {
        const panzoom = get().panzoom
        if (!panzoom) {
          return
        }

        const position = get().nodeIndex[nodeId].position

        panzoom.pan(-(position.x - START_X), -(position.y - START_Y), {
          animate: true,
          duration: 250,
        })
      },
    }))

  return <Provider createStore={createStore}>{children}</Provider>
}

export default ZoomUtilProvider
export interface Props {
  children: ReactNode
}

export { useZoomUtilStore }

export interface ZoomUtilStore {
  panzoom?: PanzoomObject
  nodeIndex: NodeIndex
  initZoomUtil: (_: InitZoomUtilArg) => void
  jump: (_: string) => void
}

export interface InitZoomUtilArg {
  panzoom: PanzoomObject
  nodeIndex: NodeIndex
}
