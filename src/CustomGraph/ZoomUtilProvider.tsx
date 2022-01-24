import { PanzoomObject } from '@panzoom/panzoom'
import React, { ReactNode } from 'react'
import create from 'zustand'
import createContext from 'zustand/context'
import { START_X, START_Y } from './constants'
import { Position } from './types'

const { Provider, useStore: useZoomUtilStore } = createContext<ZoomUtilStore>()
const ZoomUtilProvider = ({ children }: Props) => {
  const createStore = () =>
    create<ZoomUtilStore>((set, get) => ({
      panzoom: undefined,
      initZoomUtil: panzoom => {
        console.log('hi')
        set({ panzoom })
      },
      jump: (position: Position) => {
        const panzoom = get().panzoom
        if (!panzoom) {
          return
        }

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

interface ZoomUtilStore {
  panzoom?: PanzoomObject
  initZoomUtil: (_: PanzoomObject) => void
  jump: (_: Position) => void
}
