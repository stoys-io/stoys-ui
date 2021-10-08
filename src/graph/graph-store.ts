import create from 'zustand'

export const useHighlightStore = create<any>(set => ({
  highlights: {},
  setHighlights: (ids: string[]) => {
    console.log(ids)
    set((state: any) => ({
      highlights: ids.reduce(
        (acc, id) => ({
          ...acc,
          [id]: state.highlights[id] ? !state.highlights[id] : true,
        }),
        state.highlights
      ),
    }))
  },
}))
