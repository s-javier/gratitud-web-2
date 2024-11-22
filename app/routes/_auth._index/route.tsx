import { eq } from 'drizzle-orm'
import { useEffect, useState } from 'react'
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node'
import { useFetcher, useNavigate } from '@remix-run/react'
import { Button, Input } from '@nextui-org/react'
import * as v from 'valibot'
import { toast } from 'sonner'
import { customAlphabet } from 'nanoid'
// @ts-ignore
import { createTransport } from 'nodemailer'

import { ErrorMessage, ErrorTitle, Page } from '~/enums'
import db from '~/db'
import { personTable, sessionTable } from '~/db/schema'
import { useIsCodeSentStore, useLoaderOverlayStore } from '~/stores'
import { dayjs } from '~/utils'

export const meta: MetaFunction = () => {
  return [{ title: 'Ingreso | Gratitud' }, { name: 'description', content: '' }]
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const errors: {
    email?: string
    server?: { title: string; message: string }
  } = {}
  const formData = await request.formData()
  const email = String(formData.get('email'))
  /* ▼ Validación de formulario */
  const errEmail = v.safeParse(
    v.pipe(
      v.string('El valor de este campo es inválido.'),
      v.trim(),
      v.nonEmpty('Este campo es requerido.'),
      v.email('El valor de este campo es inválido.'),
    ),
    email,
  )
  if (errEmail.issues) {
    errors.email = errEmail.issues[0].message
  }
  if (Object.keys(errors).length > 0) {
    return { errors }
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
      errors.server = {
        title: ErrorTitle.SERVER_GENERIC,
        message: ErrorMessage.SERVER_GENERIC,
      }
      return { errors }
    }
    user = query[0]
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error en DB. Consulta de usuario.')
      console.info(err)
    }
    errors.server = {
      title: ErrorTitle.SERVER_GENERIC,
      message: ErrorMessage.SERVER_GENERIC,
    }
    return { errors }
  }
  if (user.isActive === false) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Usuario no activo.')
    }
    errors.server = {
      title: ErrorTitle.SERVER_GENERIC,
      message: ErrorMessage.SERVER_GENERIC,
    }
    return { errors }
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
    errors.server = {
      title: ErrorTitle.SERVER_GENERIC,
      message: ErrorMessage.SERVER_GENERIC,
    }
    return { errors }
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
    errors.server = {
      title: ErrorTitle.SERVER_GENERIC,
      message: ErrorMessage.SERVER_GENERIC,
    }
    return { errors }
  }
  // return redirect(Page.CODE)
  return { isCodeSent: true }
}

export default function AuthLoginRoute() {
  const fetcher = useFetcher<typeof action>()
  const setLoaderOverlay = useLoaderOverlayStore((state) => state.setLoaderOverlay)
  const [errEmail, setErrEmail] = useState('')
  const navigate = useNavigate()
  const setIsCodeSent = useIsCodeSentStore((state) => state.setIsCodeSent)

  useEffect(() => {
    setLoaderOverlay(fetcher.state !== 'idle')
    if (fetcher.state === 'idle' && fetcher.data?.errors) {
      if (fetcher.data.errors.server) {
        toast.error(fetcher.data.errors.server.title, {
          description: fetcher.data.errors.server.message || undefined,
          duration: 5000,
        })
      }
      if (fetcher.data.errors.email) {
        setErrEmail(fetcher.data.errors.email)
      }
      toast.error('Por favor corrige el error del campo email para continuar', {
        duration: 5000,
      })
    }
    if (fetcher.state === 'idle' && fetcher.data?.isCodeSent) {
      setIsCodeSent(true)
      navigate(Page.CODE)
    }
  }, [fetcher])

  return (
    <fetcher.Form method="post">
      <Input
        name="email"
        type="email"
        label="Email"
        className="mb-8"
        classNames={{
          inputWrapper: [
            'border-gray-400 border-[1px]',
            'hover:!border-[var(--o-input-border-hover-color)]',
            'group-data-[focus=true]:border-[var(--o-input-border-hover-color)]',
          ],
        }}
        size="lg"
        variant="bordered"
        isInvalid={errEmail ? true : false}
        errorMessage={errEmail}
        onFocus={() => setErrEmail('')}
      />
      <Button
        type="submit"
        size="lg"
        className={[
          'w-full',
          'text-[var(--o-btn-primary-text-color)]',
          'bg-[var(--o-btn-primary-bg-color)]',
        ].join(' ')}
      >
        Ingresar
      </Button>
    </fetcher.Form>
  )
}
