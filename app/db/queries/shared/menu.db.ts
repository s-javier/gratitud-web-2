import { asc, eq } from 'drizzle-orm'

import { CacheData, ErrorTitle } from '~/enums'
import db from '~/db'
import { menupageTable, permissionTable, rolePermissionTable } from '~/db/schema'
import { cache } from '~/utils/cache'

export type ErrorFromGetMenuDB = {
  kind: 'error-user-menu'
  server: { title: string; message: string }
}

export type DataFromGetMenuFromDB = {
  kind: 'data-user-menu'
  menu: {
    title: string
    icon: string | null
    path: string
  }[]
}

export const getMenuFromDB = async (roleId: string) => {
  let data: DataFromGetMenuFromDB = {
    kind: 'data-user-menu',
    menu: [],
  }
  if (cache.has(JSON.stringify({ data: CacheData.MENU, roleId }))) {
    data.menu = cache.get(JSON.stringify({ data: CacheData.MENU, roleId })) as any[]
  } else {
    data.menu = await db
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
    cache.set(JSON.stringify({ data: CacheData.MENU, roleId }), data.menu)
  }
  if (data.menu.length === 0) {
    if (process.env.NODE_ENV) {
      console.error('El usuario no tiene menú.')
    }
    return {
      kind: 'error-user-menu',
      server: {
        title: ErrorTitle.SERVER_GENERIC,
        message: 'El usuario no tiene menú.',
      },
    } as ErrorFromGetMenuDB
  }
  return data
}
