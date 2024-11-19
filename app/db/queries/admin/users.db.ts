import db from '~/db'
import { personTable } from '~/db/schema'
import { CacheData } from '~/enums'
import { cache } from '~/utils/cache'

export const getUsersAllFromDB = async () => {
  let users: any[] = []
  if (cache.has(JSON.stringify({ data: CacheData.USERS_ALL }))) {
    users = cache.get(JSON.stringify({ data: CacheData.USERS_ALL })) as any[]
  } else {
    users = await db
      .select({
        id: personTable.id,
        name: personTable.name,
        email: personTable.email,
        isActive: personTable.isActive,
      })
      .from(personTable)
    cache.set(JSON.stringify({ data: CacheData.USERS_ALL }), users)
  }
  return users
}
