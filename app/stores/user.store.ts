import { create } from 'zustand'

export const useUserStore = create<{
  id: string
  organizationId: string
  roleId: string
  menu: {
    title: string
    icon: string | null
    path: string
  }[]
  firstName: string
  setUser: (
    value: { userId: string; organizationId: string; roleId: string } & {
      menu: {
        title: string
        icon: string | null
        path: string
      }[]
      firstName: string
    },
  ) => void
}>()((set) => ({
  id: '',
  organizationId: '',
  roleId: '',
  menu: [],
  firstName: '',
  setUser: (
    value: { userId: string; organizationId: string; roleId: string } & {
      menu: {
        title: string
        icon: string | null
        path: string
      }[]
      firstName: string
    },
  ) =>
    set({
      id: value.userId,
      organizationId: value.organizationId,
      roleId: value.roleId,
      menu: value.menu,
      firstName: value.firstName,
    }),
}))
