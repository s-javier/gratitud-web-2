import { ErrorMessage, ErrorTitle, Page } from '~/enums'
import { getPermissionsFromDB } from '~/db/queries'

export type ErrorFromVerifyUserPermission = {
  kind: 'error-from-verifyUserPermission'
  server: { title: string; message: string }
}

export type DataFromVerifyUserPermission = {
  kind: 'data-from-verifyUserPermission'
  hasPermission: boolean
}

export const verifyUserPermission = async (
  roleId: string,
  path: string,
): Promise<ErrorFromVerifyUserPermission | DataFromVerifyUserPermission> => {
  let query: any[] = []
  try {
    query = await getPermissionsFromDB(roleId)
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. Verificación de permisos.')
      console.info(err)
    }
    return {
      kind: 'error-from-verifyUserPermission',
      server: {
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
      kind: 'error-from-verifyUserPermission',
      server: {
        title: ErrorTitle.SERVER_GENERIC,
        message: ErrorMessage.SERVER_GENERIC,
      },
    }
  }
  if (!query.includes(path)) {
    return {
      kind: 'error-from-verifyUserPermission',
      server: {
        title: ErrorTitle.SERVER_GENERIC,
        message: ErrorMessage.SERVER_GENERIC,
      },
    }
  }
  return {
    kind: 'data-from-verifyUserPermission',
    hasPermission: true,
  }
}
