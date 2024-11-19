import db from '~/db'
import { organizationTable } from '~/db/schema'
import { CacheData } from '~/enums'
import { cache } from '~/utils/cache'

export const getOrganizationsAllFromDB = async () => {
  let organizations: any[] = []
  if (cache.has(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL }))) {
    organizations = cache.get(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL })) as any[]
  } else {
    organizations = await db
      .select({
        id: organizationTable.id,
        title: organizationTable.title,
        isActive: organizationTable.isActive,
      })
      .from(organizationTable)
    cache.set(JSON.stringify({ data: CacheData.ORGANIZATIONS_ALL }), organizations)
  }
  return organizations
}
