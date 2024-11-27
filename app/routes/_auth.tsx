import { useEffect } from 'react'
import { Outlet, useNavigation } from '@remix-run/react'

import { useLoaderOverlayStore } from '~/stores'

export default function AuthLayout() {
  const navigation = useNavigation()
  const setLoaderOverlay = useLoaderOverlayStore((state) => state.setLoaderOverlay)

  useEffect(() => {
    setLoaderOverlay(navigation.state !== 'idle')
  }, [navigation])

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-12">
        <header className="flex flex-col items-center gap-9">
          {/* ↓ Logo */}
          <div className="h-[144px] w-[434px]">
            <img src="/logo-light.png" alt="Remix" className="block w-full dark:hidden" />
            <img src="/logo-dark.png" alt="Remix" className="hidden w-full dark:block" />
          </div>
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Ingresa a tu cuenta
          </h1>
        </header>

        <div className="mt-10 sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
