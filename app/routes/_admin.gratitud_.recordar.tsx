import { MetaFunction } from '@remix-run/node'

import AdminHeader from '~/components/admin/AdminHeader'
import AdminMain from '~/components/admin/AdminMain'

// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   const token = await userTokenCookie.parse(request.headers.get('Cookie'))
//   return null
// }

export const meta: MetaFunction = () => {
  return [{ title: 'Recordar | Gratitud' }, { name: 'description', content: '' }]
}

export default function AdminWelcomeRoute() {
  return (
    <>
      <AdminHeader
        title={
          <h1 className="max-w-[800px] text-3xl font-bold tracking-tight text-white">Recordar</h1>
        }
        buttons=""
      />
      <AdminMain>
        <div></div>
      </AdminMain>
    </>
  )
}
