import { create } from 'zustand'
import { DataFromGetMenuFromDB, DataFromVerifyUserToken } from '~/db/queries'

export const useUserStore = create<{
  id: string
  organizationId: string
  roleId: string
  menu: DataFromGetMenuFromDB['menu']
  firstName: string
  setUser: (
    value: Omit<DataFromVerifyUserToken, 'kind'> & {
      menu: DataFromGetMenuFromDB['menu']
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
    value: Omit<DataFromVerifyUserToken, 'kind'> & {
      menu: DataFromGetMenuFromDB['menu']
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
