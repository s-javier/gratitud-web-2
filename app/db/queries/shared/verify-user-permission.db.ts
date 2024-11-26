import { ErrorMessage, ErrorTitle, Page } from '~/enums'
import { getPermissionsFromDB } from '~/db/queries'

export const verifyUserPermission = async (
  roleId: string,
  path: string,
): Promise<{
  serverError?: { title: string; message: string }
  hasPermission?: boolean
}> => {
  let query: any[] = []
  try {
    query = await getPermissionsFromDB(roleId)
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. Verificación de permisos.')
      console.info(err)
    }
    return {
      serverError: {
        title: ErrorTitle.SERVER_GENERIC,
        message: ErrorMessage.SERVER_GENERIC,
      },
    }
  }
  if (query.length === 0) {
    if (process.env.NODE_ENV) {
      console.error('El usuario no tiene permisos asignados.')
    }
    return {
      serverError: {
        title: ErrorTitle.SERVER_GENERIC,
        message: ErrorMessage.SERVER_GENERIC,
      },
    }
  }
  if (!query.includes(path)) {
    return {
      serverError: {
        title: ErrorTitle.SERVER_GENERIC,
        message: ErrorMessage.SERVER_GENERIC,
      },
    }
  }
  return {
    hasPermission: true,
  }
}
