import { create } from 'zustand'

export const useLoaderOverlayStore = create<{
  loaderOverlay: boolean
  setLoaderOverlay: (value: boolean) => void
}>()((set) => ({
  loaderOverlay: false,
  setLoaderOverlay: (value: boolean) => set({ loaderOverlay: value }),
  // inc: () => set((state) => ({ count: state.count + 1 })),
}))
