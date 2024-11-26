import { and, eq } from 'drizzle-orm'

import { ErrorMessage, ErrorTitle } from '~/enums'
import db from '~/db'
import { organizationPersonRoleTable, sessionTable } from '~/db/schema'
import { dayjs } from '../../../utils/dayjs'

export const verifyUserToken = async (
  userToken: string,
): Promise<{
  serverError?: { title: string; message: string }
  userId?: string
  organizationId?: string
  roleId?: string
}> => {
  if (!userToken) {
    if (process.env.NODE_ENV) {
      console.error('userToken no encontrado en headers.')
    }
    return {
      serverError: {
        title: ErrorTitle.SERVER_GENERIC,
        message: ErrorMessage.SERVER_GENERIC,
      },
    }
  }
  let session
  try {
    const query = await db
      .select({
        personId: sessionTable.personId,
        expiresAt: sessionTable.expiresAt,
        isActive: sessionTable.isActive,
      })
      .from(sessionTable)
      .where(eq(sessionTable.id, userToken))
    if (query.length === 0) {
      if (process.env.NODE_ENV) {
        console.error('userToken no encontrado en DB.')
      }
      return {
        serverError: {
          title: ErrorTitle.SERVER_GENERIC,
          message: ErrorMessage.SERVER_GENERIC,
        },
      }
    }
    session = query[0]
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. Consulta session por userToken.')
      console.log(err)
    }
    return {
      serverError: {
        title: ErrorTitle.SERVER_GENERIC,
        message: ErrorMessage.SERVER_GENERIC,
      },
    }
  }
  if (session.isActive === false) {
    if (process.env.NODE_ENV) {
      console.error('userToken no está activo.')
    }
    return {
      serverError: {
        title: ErrorTitle.SERVER_GENERIC,
        message: ErrorMessage.SERVER_GENERIC,
      },
    }
  }
  if (dayjs.utc().isAfter(session.expiresAt)) {
    if (process.env.NODE_ENV) {
      console.error('userToken expiró.')
    }
    return {
      serverError: {
        title: ErrorTitle.SERVER_GENERIC,
        message: ErrorMessage.SERVER_GENERIC,
      },
    }
  }
  let userOrgRole
  try {
    const query = await db
      .select({
        organizationId: organizationPersonRoleTable.organizationId,
        roleId: organizationPersonRoleTable.roleId,
      })
      .from(organizationPersonRoleTable)
      .where(
        and(
          eq(organizationPersonRoleTable.personId, session.personId),
          eq(organizationPersonRoleTable.isSelected, true),
        ),
      )
    if (query.length === 0) {
      if (process.env.NODE_ENV) {
        console.error('El usuario no está vinculado a una organización ni a un rol.')
      }
      return {
        serverError: {
          title: ErrorTitle.SERVER_GENERIC,
          message: ErrorMessage.SERVER_GENERIC,
        },
      }
    }
    userOrgRole = query[0]
  } catch (err) {
    if (process.env.NODE_ENV) {
      console.error('Error en DB. Consulta si usuario está asociado a una organización y un rol.')
    }
    return {
      serverError: {
        title: ErrorTitle.SERVER_GENERIC,
        message: ErrorMessage.SERVER_GENERIC,
      },
    }
  }
  // TODO: Verificar si ip e user_agent de la request coinciden con el de la session
  /* Esto asume que una persona solo puede tener un rol en una organización */
  return {
    userId: session.personId,
    organizationId: userOrgRole.organizationId,
    roleId: userOrgRole.roleId,
  }
}
