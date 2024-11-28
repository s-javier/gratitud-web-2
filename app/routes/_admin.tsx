import { useEffect } from 'react'
import { type LoaderFunctionArgs, redirect } from '@remix-run/node'
import { Outlet, useLoaderData, useNavigation } from '@remix-run/react'
import { toast } from 'sonner'

import { Page } from '~/enums'
import { userTokenCookie } from '~/utils'
import {
  verifyUserToken,
  verifyUserPermission,
  getMenuFromDB,
  getFirstNameFromDB,
} from '~/db/queries'
import { useUserStore, useLoaderOverlayStore } from '~/stores'
import Footer from '~/components/shared/Footer'

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  let response
  let middlewareResolve!: (value: unknown) => void
  context.middleware = new Promise((resolve) => {
    middlewareResolve = resolve
  })

  const userToken = await userTokenCookie.parse(request.headers.get('Cookie'))
  const verifiedUserToken = await verifyUserToken(userToken)
  if (verifiedUserToken.serverError) {
    middlewareResolve('error')
    return redirect(Page.LOGIN)
  }

  const currentUrl = new URL(request.url)
  const pathname = currentUrl.pathname
  if (pathname !== Page.ADMIN_WELCOME) {
    const verifiedUserPermission = await verifyUserPermission(verifiedUserToken.roleId!, pathname)
    if (verifiedUserPermission.serverError) {
      middlewareResolve('error')
      return redirect(Page.ADMIN_WELCOME)
    }
  }

  response = {
    ...verifiedUserToken,
  }

  const menuData = await getMenuFromDB(verifiedUserToken.roleId!)
  if (menuData.serverError) {
    middlewareResolve('error')
    return {
      ...response,
      ...menuData.serverError,
    }
  }

  response = {
    ...response,
    ...menuData,
  }
  middlewareResolve(verifiedUserToken)

  const firstNameData = await getFirstNameFromDB(verifiedUserToken.userId!)
  response = {
    ...response,
    ...firstNameData,
  }
  return response
}

export default function AdminLayout() {
  const navigation = useNavigation()
  const loader = useLoaderData<{
    serverError?: { title: string; message: string }
    userId?: string
    organizationId?: string
    roleId?: string
    menu?: {
      title: string
      icon: string | null
      path: string
    }[]
    firstName?: string
  }>()
  const setLoaderOverlay = useLoaderOverlayStore((state) => state.setLoaderOverlay)
  const setUser = useUserStore((state) => state.setUser)

  useEffect(() => {
    if (loader?.serverError) {
      toast.error(loader.serverError.title, {
        description: loader.serverError.message || undefined,
        duration: 5000,
      })
    }
    setUser({
      userId: loader?.userId || '',
      organizationId: loader?.organizationId || '',
      roleId: loader?.roleId || '',
      menu: loader?.menu || [],
      firstName: loader?.firstName || '',
    })
  }, [loader])

  useEffect(() => {
    setLoaderOverlay(navigation.state !== 'idle')
  }, [navigation])

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
