import { useEffect } from 'react'
import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'

import { ErrorTitle, Page } from '~/enums'
import { userTokenCookie } from '~/utils'
import {
  type DataFromVerifyUserToken,
  type ErrorFromGetMenuDB,
  type DataFromGetMenuFromDB,
  type ErrorFromGetFirstNameFromDB,
  type DataFromGetFirstNameFromDB,
  verifyUserToken,
  verifyUserPermission,
  getMenuFromDB,
  getFirstNameFromDB,
} from '~/db/queries'
import { useUserStore } from '~/stores'
import Footer from '~/components/shared/Footer'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userToken = await userTokenCookie.parse(request.headers.get('Cookie'))
  const verifiedUserToken = await verifyUserToken(userToken)
  if (verifiedUserToken.kind === 'error-from-verifyUserToken') {
    return redirect(Page.LOGIN)
  }
  const currentUrl = new URL(request.url)
  const pathname = currentUrl.pathname
  if (pathname !== Page.ADMIN_WELCOME) {
    const verifiedUserPermission = await verifyUserPermission(verifiedUserToken.roleId, pathname)
    if (verifiedUserPermission.kind === 'error-from-verifyUserPermission') {
      return redirect(Page.ADMIN_WELCOME)
    }
  }
  let menuData: ErrorFromGetMenuDB | DataFromGetMenuFromDB
  try {
    menuData = await getMenuFromDB(verifiedUserToken.roleId)
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. Obtención de menú del usuario.')
      console.info(err)
    }
    return {
      ...verifiedUserToken,
      kind: 'error-user-menu',
      server: {
        title: ErrorTitle.SERVER_GENERIC,
        message: 'No se pudo obtener el menú del usuario.',
      },
    } as DataFromVerifyUserToken & ErrorFromGetMenuDB
  }
  let firstName: ErrorFromGetFirstNameFromDB | DataFromGetFirstNameFromDB
  try {
    firstName = await getFirstNameFromDB(verifiedUserToken.userId)
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. Obtención del nombre del usuario.')
      console.info(err)
    }
    return {
      ...verifiedUserToken,
      ...menuData,
      kind: 'error-user-first-name',
      server: {
        title: ErrorTitle.SERVER_GENERIC,
        message: 'No se pudo obtener el nombre del usuario.',
      },
    } as DataFromVerifyUserToken & ErrorFromGetFirstNameFromDB
  }
  return { ...verifiedUserToken, ...menuData }
}

export default function AdminLayout() {
  const loader = useLoaderData<
    Omit<DataFromVerifyUserToken, 'kind'> &
      (
        | ErrorFromGetMenuDB
        | Omit<DataFromGetMenuFromDB, 'kind'>
        | ErrorFromGetFirstNameFromDB
        | Omit<DataFromGetFirstNameFromDB, 'kind'>
      )
  >()
  const setUser = useUserStore((state) => state.setUser)

  useEffect(() => {
    setUser({
      userId: loader.userId,
      organizationId: loader.organizationId,
      roleId: loader.roleId,
      menu: loader.kind === 'error-user-menu' ? [] : loader.menu,
      firstName: loader.kind === 'error-user-first-name' ? '' : loader.firstName,
    })
  }, [loader])

  return (
    <div className="flex flex-col h-full">
      <div className="grow">
        <Outlet />
      </div>
      <div className="flex-none">
        <Footer />
      </div>
    </div>
  )
}
