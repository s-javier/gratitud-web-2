import { eq } from 'drizzle-orm'
import type { ActionFunctionArgs } from '@remix-run/node'
import * as v from 'valibot'
import { customAlphabet } from 'nanoid'
// @ts-ignore
import { createTransport } from 'nodemailer'

import { ErrorMessage, ErrorTitle } from '~/enums'
import db from '~/db'
import { personTable, sessionTable } from '~/db/schema'
import { dayjs } from '~/utils'

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const email = String(formData.get('email'))
  /* ▼ Validación de formulario */
  const emailErr = v.safeParse(
    v.pipe(
      v.string('El valor de este campo es inválido.'),
      v.trim(),
      v.nonEmpty('Este campo es requerido.'),
      v.email('El valor de este campo es inválido.'),
    ),
    email,
  )
  if (emailErr.issues) {
    return { errors: { email: emailErr.issues[0].message } }
  }
  /* ▲ Validación de formulario */
  let user
  try {
    const query = await db
      .select({
        id: personTable.id,
        name: personTable.name,
        isActive: personTable.isActive,
      })
      .from(personTable)
      .where(eq(personTable.email, email))
    if (query.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Usuario no encontrado.')
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
    user = query[0]
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error en DB. Consulta de usuario.')
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
  if (user.isActive === false) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Usuario no activo.')
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
  /* ▼ Crear sesión */
  const alphabet = '0123456789'
  const code = customAlphabet(alphabet, 6)()
  const expiresAt = dayjs.utc().add(Number(process.env.SESSION_DAYS), 'day').toDate()
  const codeExpiresAt = dayjs.utc().add(5, 'minute').toDate()
  try {
    await db.insert(sessionTable).values({
      personId: user.id,
      expiresAt,
      code,
      codeExpiresAt,
      codeIsActive: true,
    })
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error en DB. Crear sesión.')
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
  /* ▲ Crear sesión */
  /* ▼ Enviar email */
  const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
    debug: true,
  })
  try {
    await transporter.sendMail({
      from: '"Condimento" <noresponder@condimento.cl>',
      to: email,
      subject: 'Ingreso',
      html: `
          <div style="background-color:rgb(207,208,209);padding-top:30px;padding-bottom:30px">
            <div style="padding:30px;font-size:14px;font-family:Lato,Helvetica,Arial,sans-serif;color:rgb(55,65,81);line-height:1.5em;width:98%;max-width:500px;border-radius:16px;margin:10px auto 0;background-color:white">
              <div style="text-align:center;">
                <img src="https://condimento.cl/images/imagotipo.png" style="width:200px;margin-bottom:30px" alt="Logo de Condimento" />
              </div>
              <p style="margin-bottom: 16px">Hola, ${user.name}:</p>
              <p style="margin-bottom: 16px">Bienvenido/a a Condimento. Por favor, utiliza este código para ingresar:</p>
              <p style="margin-bottom: 30px; text-align: center;">${code}</p>
              <p>Que tengas un buen día.</p>
            </div>
          </div>
        `,
    })
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error en enviar email.')
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
  // return redirect(Page.CODE)
  return { isCodeSent: true }
}
