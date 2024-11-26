import { useState } from 'react'
import { MetaFunction } from '@remix-run/node'

import { gratitudeTable } from '~/db/schema'
import db from '~/db'
import AdminHeader from '~/components/admin/AdminHeader'
import AdminMain from '~/components/admin/AdminMain'
import Thank from '~/components/gratitude/Thank'
import TableActions from '~/components/shared/TableActions'

export const loader = async () => {
  let data
  try {
    data = await db
      .select({
        id: gratitudeTable.id,
        title: gratitudeTable.title,
        description: gratitudeTable.description,
        createdAt: gratitudeTable.createdAt,
      })
      .from(gratitudeTable)
      .where(
        and(
          eq(gratitudeTable.personId, Astro.locals.userId),
          eq(gratitudeTable.isMaterialized, true),
        ),
      )
      .orderBy(desc(gratitudeTable.createdAt))
  } catch {
    if (import.meta.env.DEV) {
      console.error('Error en DB. Obtención de agradecimeintos.')
    }
    error = handleErrorFromServer(Error.DB)
  }
}

export const meta: MetaFunction = () => {
  return [{ title: 'Mis agradecimientos | Gratitud' }, { name: 'description', content: '' }]
}

export default function AdminWelcomeRoute() {
  const [gratitude, setGratitude] = useState<any>({})
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  // const filteredItems = useMemo(() =>
  //   props.data.filter((item) => {
  //     return item.description.toLowerCase().includes(searchText().toLowerCase())
  //   }),
  // )

  return (
    <>
      <AdminHeader
        title={
          <h1 className="max-w-[800px] text-3xl font-bold tracking-tight text-white">
            Mis agradecimientos
          </h1>
        }
        buttons=""
      />
      <AdminMain>
        <div className="max-w-[600px] m-auto">
          <p className="text-sm text-gray-500 text-center mb-4">
            {/* Estas viendo {filteredItems().length}{' '}
          {filteredItems().length === 1 ? 'agradecimiento' : 'agradecimientos'}. */}
          </p>
          {[{ title: 'Hola', description: 'Hola. Esto es una descripción.' }].map(
            (item: any, index: number) => (
              <Thank index={index} item={item} key={index}>
                <TableActions
                  infoClick={() => {
                    setGratitude(item)
                    setIsInfoOpen(true)
                  }}
                  editClick={() => {
                    setGratitude(item)
                    setIsEditOpen(true)
                  }}
                  deleteClick={() => {
                    setGratitude(item)
                    setIsDeleteOpen(true)
                  }}
                />
              </Thank>
            ),
          )}
        </div>
      </AdminMain>
    </>
  )
}
