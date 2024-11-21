import { Outlet } from '@remix-run/react'

import Footer from '~/components/shared/Footer'

export default function AdminLayout() {
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
