import { eq } from 'drizzle-orm'

import db from '~/db'
import { personTable } from '~/db/schema'
import { CacheData, ErrorMessage, ErrorTitle } from '~/enums'
import { cache } from '~/utils/cache'

export const getFirstNameFromDB = async (
  userId: string,
): Promise<{
  serverError?: { title: string; message: string }
  firstName?: string
}> => {
  let firstName = ''
  if (cache.has(JSON.stringify({ data: CacheData.FIRST_NAME, userId }))) {
    firstName = cache.get(JSON.stringify({ data: CacheData.FIRST_NAME, userId })) as string
    return { firstName }
  }
  try {
    const query = await db
      .select({ name: personTable.name })
      .from(personTable)
      .where(eq(personTable.id, userId))
    if (query.length === 0) {
      if (process.env.NODE_ENV) {
        console.error('Usuario no encontrado.')
      }
      return {
        serverError: {
          title: ErrorTitle.SERVER_GENERIC,
          message: ErrorMessage.SERVER_GENERIC,
        },
      }
    }
    firstName = query[0].name
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. Obtención del nombre del usuario.')
      console.info(err)
    }
    return {
      serverError: {
        title: ErrorTitle.SERVER_GENERIC,
        message: 'No se pudo obtener el nombre del usuario.',
      },
    }
  }
  cache.set(JSON.stringify({ data: CacheData.FIRST_NAME, userId }), firstName)
  return { firstName }
}
