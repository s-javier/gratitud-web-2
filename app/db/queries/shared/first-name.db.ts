import { eq } from 'drizzle-orm'

import db from '~/db'
import { personTable } from '~/db/schema'
import { CacheData, ErrorMessage, ErrorTitle } from '~/enums'
import { cache } from '~/utils/cache'

export type ErrorFromGetFirstNameFromDB = {
  kind: 'error-user-first-name'
  server: { title: string; message: string }
}

export type DataFromGetFirstNameFromDB = {
  kind: 'data-user-first-name'
  firstName: string
}

export const getFirstNameFromDB = async (userId: string) => {
  let data: DataFromGetFirstNameFromDB = {
    kind: 'data-user-first-name',
    firstName: '',
  }
  if (cache.has(JSON.stringify({ data: CacheData.FIRST_NAME, userId }))) {
    data.firstName = cache.get(JSON.stringify({ data: CacheData.FIRST_NAME, userId })) as string
  } else {
    const query = await db
      .select({ name: personTable.name })
      .from(personTable)
      .where(eq(personTable.id, userId))
    if (query.length === 0) {
      if (process.env.NODE_ENV) {
        console.error('Usuario no encontrado.')
      }
      return {
        kind: 'error-user-first-name',
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: ErrorMessage.SERVER_GENERIC,
        },
      } as ErrorFromGetFirstNameFromDB
    } else {
      data.firstName = query[0].name
    }
    cache.set(JSON.stringify({ data: CacheData.FIRST_NAME, userId }), data.firstName)
  }
  return data
}
