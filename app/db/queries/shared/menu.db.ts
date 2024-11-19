import { asc, eq } from 'drizzle-orm'

import db from '~/db'
import { menupageTable, permissionTable, rolePermissionTable } from '~/db/schema'
import { CacheData } from '~/enums'
import { cache } from '~/utils/cache'

export const getMenuFromDB = async (roleId: string) => {
  let menu: any[] = []
  if (cache.has(JSON.stringify({ data: CacheData.MENU, roleId }))) {
    menu = cache.get(JSON.stringify({ data: CacheData.MENU, roleId })) as any[]
  } else {
    menu = await db
      .select({
        title: menupageTable.title,
        icon: menupageTable.icon,
        path: permissionTable.path,
      })
      .from(menupageTable)
      .innerJoin(permissionTable, eq(menupageTable.permissionId, permissionTable.id))
      .innerJoin(rolePermissionTable, eq(permissionTable.id, rolePermissionTable.permissionId))
      .where(eq(rolePermissionTable.roleId, roleId))
      .orderBy(asc(rolePermissionTable.sort))
    cache.set(JSON.stringify({ data: CacheData.MENU, roleId }), menu)
  }
  return menu
}
