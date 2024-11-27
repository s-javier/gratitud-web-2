import { and, desc, eq } from 'drizzle-orm'

import { CacheData, ErrorTitle } from '~/enums'
import db from '~/db'
import { gratitudeTable } from '~/db/schema'
import { cache } from '~/utils/cache'

export const getMyGratitudesFromDB = async (
  userId: string,
): Promise<{
  serverError?: { title: string; message: string }
  myGratitudes?: {
    id: string
    title: string | null
    description: string
    createdAt: Date
  }[]
}> => {
  let myGratitudes
  if (cache.has(JSON.stringify({ data: CacheData.MY_GRATITUDES, userId }))) {
    myGratitudes = cache.get(JSON.stringify({ data: CacheData.MY_GRATITUDES, userId })) as any[]
  }
  try {
    myGratitudes = await db
      .select({
        id: gratitudeTable.id,
        title: gratitudeTable.title,
        description: gratitudeTable.description,
        createdAt: gratitudeTable.createdAt,
      })
      .from(gratitudeTable)
      .where(and(eq(gratitudeTable.personId, userId), eq(gratitudeTable.isMaterialized, true)))
      .orderBy(desc(gratitudeTable.createdAt))
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. Obtención de gratitudes del usuario.')
      console.info(err)
    }
    return {
      serverError: {
        title: ErrorTitle.SERVER_GENERIC,
        message: 'No se pudo obtener las gratitudes del usuario.',
      },
    }
  }
  cache.set(JSON.stringify({ data: CacheData.MY_GRATITUDES, userId }), myGratitudes)
  return { myGratitudes }
}
