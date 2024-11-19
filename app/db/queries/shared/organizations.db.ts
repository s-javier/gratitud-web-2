import { eq } from 'drizzle-orm'

import db from '~/db'
import { organizationPersonRoleTable, organizationTable } from '~/db/schema'
import { CacheData } from '~/enums'
import { cache } from '~/utils/cache'

export const getOrganizationsToChangeFromDB = async (userId: string) => {
  let organizations: any[] = []
  if (cache.has(JSON.stringify({ data: CacheData.ORGANIZATIONS_TO_CHANGE, userId }))) {
    organizations = cache.get(
      JSON.stringify({ data: CacheData.ORGANIZATIONS_TO_CHANGE, userId }),
    ) as any[]
  } else {
    organizations = await db
      .select({
        id: organizationTable.id,
        title: organizationTable.title,
        isSelected: organizationPersonRoleTable.isSelected,
      })
      .from(organizationTable)
      .innerJoin(
        organizationPersonRoleTable,
        eq(organizationTable.id, organizationPersonRoleTable.organizationId),
      )
      .where(eq(organizationPersonRoleTable.personId, userId))
    cache.set(JSON.stringify({ data: CacheData.ORGANIZATIONS_TO_CHANGE, userId }), organizations)
  }
  return organizations
}
