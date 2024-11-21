import { LoaderFunctionArgs } from '@remix-run/node'

import { tokenCookie } from '~/utils'
import AdminHeader from '~/components/admin/AdminHeader'
import AdminMain from '~/components/admin/AdminMain'
import Notebook from '~/components/svg/Notebook'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const token = await tokenCookie.parse(request.headers.get('Cookie'))
  console.log(token)
  return null
}

export default function AdminWelcomeRoute() {
  return (
    <>
      <AdminHeader
        title={
          <h1
            slot="view-title"
            className="max-w-[800px] text-3xl font-bold tracking-tight text-white"
          >
            Bienvenido/a
          </h1>
        }
        buttons=""
      />
      <AdminMain>
        <div className="m-auto flex max-w-3xl flex-col items-center gap-x-12 gap-y-6 px-0 py-6 md:flex-row md:px-12">
          <Notebook className="max-w-xs md:w-full" />
          <p className="flex max-w-xs flex-row items-center text-center md:text-left">
            Hola, bienvenido/a. Si tienes dudas o crees que este sistema puede mejorar, por favor,
            envía tus comentarios a "ayuda@gratitud.cl".
          </p>
        </div>
      </AdminMain>
    </>
  )
}
