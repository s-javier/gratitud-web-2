import { asc, eq } from 'drizzle-orm'

import { CacheData, ErrorTitle } from '~/enums'
import db from '~/db'
import { menupageTable, permissionTable, rolePermissionTable } from '~/db/schema'
import { cache } from '~/utils/cache'

export const getMenuFromDB = async (
  roleId: string,
): Promise<{
  serverError?: { title: string; message: string }
  menu?: {
    title: string
    icon: string | null
    path: string
  }[]
}> => {
  let menu
  if (cache.has(JSON.stringify({ data: CacheData.MENU, roleId }))) {
    menu = cache.get(JSON.stringify({ data: CacheData.MENU, roleId })) as any[]
  }
  try {
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
    if (menu.length === 0) {
      if (process.env.NODE_ENV) {
        console.error('El usuario no tiene menú.')
      }
      return {
        serverError: {
          title: ErrorTitle.SERVER_GENERIC,
          message: 'El usuario no tiene menú.',
        },
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. Obtención de menú del usuario.')
      console.info(err)
    }
    return {
      serverError: {
        title: ErrorTitle.SERVER_GENERIC,
        message: 'No se pudo obtener el menú del usuario.',
      },
    }
  }
  cache.set(JSON.stringify({ data: CacheData.MENU, roleId }), menu)
  return { menu }
}
