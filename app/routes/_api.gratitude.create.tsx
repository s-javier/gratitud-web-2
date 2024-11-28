import { ActionFunctionArgs, redirect } from '@remix-run/node'

import { Api, ErrorMessage, ErrorTitle, Page } from '~/enums'
import { gratitudeCreateValidation, userTokenCookie } from '~/utils'
import db from '~/db'
import { verifyUserPermission, verifyUserToken } from '~/db/queries'
import { gratitudeTable } from '~/db/schema'

export const loader = () => {
  return new Response('Not Found', { status: 404 })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return new Response('Not Found', { status: 404 })
  }
  const userToken = await userTokenCookie.parse(request.headers.get('Cookie'))
  const verifiedUserToken = await verifyUserToken(userToken)
  if (verifiedUserToken.serverError) {
    return redirect(Page.LOGIN)
  }

  const currentUrl = new URL(request.url)
  const pathname = currentUrl.pathname
  const verifiedUserPermission = await verifyUserPermission(verifiedUserToken.roleId!, pathname)
  if (verifiedUserPermission.serverError) {
    return redirect(Page.ADMIN_WELCOME)
  }

  const formData = await request.formData()
  const title = String(formData.get('title')).trim()
  const description = String(formData.get('description')).trim()
  const userId = String(formData.get('userId')).trim()
  const isMaterialized = Boolean(formData.get('isMaterialized'))

  /* ▼ Validación de formulario */
  const validationErrors = gratitudeCreateValidation({ title: title || undefined, description })
  if (Object.keys(validationErrors.errors).length > 0) {
    return validationErrors
  }
  /* ▲ Validación de formulario */

  try {
    await db.insert(gratitudeTable).values({
      personId: userId,
      title,
      description,
      isMaterialized,
    })
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error en DB. Creación de gratitud.')
      console.info(err)
    }
    return {
      errors: {
        server: {
          title: ErrorTitle.SERVER_GENERIC,
          message: ErrorMessage.SERVER_GENERIC,
        },
      },
    }
  }

  return { isGratitudeCreated: true }
}
