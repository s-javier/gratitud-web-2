import { eq } from 'drizzle-orm'

import { CacheData } from '~/enums'
import db from '~/db'
import { permissionTable, rolePermissionTable, roleTable } from '~/db/schema'
import { cache } from '~/utils/cache'

export const getPermissionsFromDB = async (roleId: string) => {
  let permissions: any[] = []
  if (cache.has(JSON.stringify({ data: CacheData.PERMISSIONS, roleId }))) {
    permissions = cache.get(JSON.stringify({ data: CacheData.PERMISSIONS, roleId })) as any[]
  } else {
    permissions = await db
      .select({ path: permissionTable.path })
      .from(roleTable)
      .innerJoin(rolePermissionTable, eq(roleTable.id, rolePermissionTable.roleId))
      .innerJoin(permissionTable, eq(rolePermissionTable.permissionId, permissionTable.id))
      .where(eq(roleTable.id, roleId))
    permissions = permissions.map((item: any) => item.path)
    cache.set(JSON.stringify({ data: CacheData.PERMISSIONS, roleId }), permissions)
  }
  return permissions
}
