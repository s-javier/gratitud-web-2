import { create } from 'zustand'

export const useIsCodeSentStore = create<{
  isCodeSent: boolean
  setIsCodeSent: (value: boolean) => void
}>()((set) => ({
  isCodeSent: false,
  setIsCodeSent: (value: boolean) => set({ isCodeSent: value }),
}))
