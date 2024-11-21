import { useEffect, useState } from 'react'
import { ActionFunctionArgs, createCookie } from '@remix-run/node'
import { Form, Link, useActionData, useNavigate, useNavigation } from '@remix-run/react'
import { OTPInput, REGEXP_ONLY_DIGITS, SlotProps } from 'input-otp'
import { Button } from '@nextui-org/react'
import * as v from 'valibot'
import { toast } from 'sonner'
import { and, eq, ne } from 'drizzle-orm'

import { ErrorMessage, ErrorTitle, Page } from '~/enums'
import { useIsCodeSentStore, useLoaderOverlayStore } from '~/stores'
import { cn, dayjs, tokenCookie } from '~/utils'
import db from '~/db'
import { sessionTable } from '~/db/schema'

export const action = async ({ request }: ActionFunctionArgs) => {
  const errors: {
    code?: string
    server?: { title: string; message: string }
  } = {}
  const formData = await request.formData()
  const code = String(formData.get('code'))
  const timeLimit = Number(formData.get('timeLimit'))
  console.log(code)
  console.log(timeLimit)
  /* ▼ Validación de formulario */
  const errCode = v.safeParse(
    v.pipe(
      v.custom(() => {
        return timeLimit > 0
      }, 'Código expirado.'),
      v.string('El valor del código es inválido.'),
      v.trim(),
      v.nonEmpty('Digitar el código es obligatorio'),
      v.regex(/^[0-9]{6}$/, 'El valor del código es inválido.'),
    ),
    code,
  )
  if (errCode.issues) {
    errors.code = errCode.issues[0].message
  }
  if (Object.keys(errors).length > 0) {
    return { errors }
  }
  /* ▲ Validación de formulario */
  let session
  try {
    const query = await db
      .select({
        id: sessionTable.id,
        personId: sessionTable.personId,
        codeExpiresAt: sessionTable.codeExpiresAt,
        codeIsActive: sessionTable.codeIsActive,
      })
      .from(sessionTable)
      .where(eq(sessionTable.code, code))
    if (query.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Sesión no encontrada.')
      }
      errors.server = {
        title: ErrorTitle.SERVER_GENERIC,
        message: ErrorMessage.SERVER_GENERIC,
      }
      return { errors }
    }
    session = query[0]
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error en DB. Obtener sesión.')
      console.info(err)
    }
    errors.server = {
      title: ErrorTitle.SERVER_GENERIC,
      message: ErrorMessage.SERVER_GENERIC,
    }
    return { errors }
  }
  if (session.codeIsActive === false) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Sesión ya utilizada.')
    }
    errors.server = {
      title: ErrorTitle.SERVER_GENERIC,
      message: ErrorMessage.SERVER_GENERIC,
    }
    return { errors }
  }
  if (dayjs.utc().isAfter(session.codeExpiresAt)) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Sesión expirada.')
    }
    errors.server = {
      title: ErrorTitle.SERVER_GENERIC,
      message: ErrorMessage.SERVER_GENERIC,
    }
    return { errors }
  }
  /* ↓ Desactivar código y activar sesión */
  try {
    await db
      .update(sessionTable)
      .set({ isActive: true, codeIsActive: false })
      .where(eq(sessionTable.id, session.id))
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error en DB. Desactivar código y activar sesión.')
      console.info(err)
    }
    errors.server = {
      title: ErrorTitle.SERVER_GENERIC,
      message: ErrorMessage.SERVER_GENERIC,
    }
    return { errors }
  }
  /* ▼ Desactivar las sesiones activas del usuario que excedan las MAX_ACTIVE_SESSIONS más nuevas */
  let sessions
  try {
    sessions = await db
      .select({ id: sessionTable.id })
      .from(sessionTable)
      .where(
        and(
          and(ne(sessionTable.id, session.id), eq(sessionTable.isActive, true)),
          eq(sessionTable.personId, session.personId),
        ),
      )
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error en DB. Consulta de sesiones a desactivar.')
      console.info(err)
    }
    errors.server = {
      title: ErrorTitle.SERVER_GENERIC,
      message: ErrorMessage.SERVER_GENERIC,
    }
    return { errors }
  }
  if (sessions.length > parseInt(process.env.MAX_ACTIVE_SESSIONS ?? '1')) {
    try {
      await db
        .update(sessionTable)
        .set({ isActive: false })
        .where(eq(sessionTable.id, sessions[parseInt(process.env.MAX_ACTIVE_SESSIONS ?? '1')].id))
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error en DB. Desactivar la sesión activa número MAX_ACTIVE_SESSIONS + 1.')
        console.info(err)
      }
      errors.server = {
        title: ErrorTitle.SERVER_GENERIC,
        message: ErrorMessage.SERVER_GENERIC,
      }
      return { errors }
    }
  }
  /* ▲ Desactivar las sesiones activas del usuario que excedan las MAX_ACTIVE_SESSIONS más nuevas */
  const cookieValue = await tokenCookie.serialize(session.id)
  return new Response(null, {
    status: 302 /* Redirección */,
    headers: {
      'Set-Cookie': cookieValue /* Configurar la cookie */,
      Location: Page.ADMIN_WELCOME /* URL de redirección */,
    },
  })
}

export default function AuthCodeRoute() {
  const navigation = useNavigation()
  const formData = useActionData<typeof action>()
  const [timeLimit, setTimeLimit] = useState(300)
  const [code, setCode] = useState('')
  const [errCode, setErrCode] = useState('')
  const setLoaderOverlay = useLoaderOverlayStore((state) => state.setLoaderOverlay)
  const navigate = useNavigate()
  const isCodeSent = useIsCodeSentStore((state) => state.isCodeSent)

  useEffect(() => {
    if (isCodeSent === false) {
      navigate(Page.LOGIN, { replace: true })
    }
    const interval = setInterval(() => {
      setTimeLimit((prevTimeLimit) => {
        if (prevTimeLimit === 0) {
          clearInterval(interval)
          return prevTimeLimit /* Mantén 0 cuando llegue a 0 */
        }
        return prevTimeLimit - 1 /* Reduce en 1 cada segundo */
      })
    }, 1000)
    /* ↓ Limpia el intervalo al desmontar el componente */
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setLoaderOverlay(navigation.state !== 'idle')
  }, [navigation])

  useEffect(() => {
    if (navigation.state === 'idle' && formData?.errors) {
      if (formData.errors.server) {
        toast.error(formData.errors.server.title, {
          description: formData.errors.server.message || undefined,
          duration: 5000,
        })
      }
      if (formData.errors.code) {
        setErrCode(formData.errors.code)
      }
      // setErrServerTitle('Por favor corrige el código para ingresar')
      toast.error(formData.errors.code || 'Por favor corrige el código para ingresar', {
        duration: 5000,
      })
    }
  }, [formData])

  return (
    isCodeSent && (
      <>
        <p className="mb-4">¡Gracias por iniciar sesión en Gratitud!</p>
        <p className="mb-4">No cierres ni actulices esta página.</p>
        <p className="mb-4">
          Se te ha enviado un email con un código para que lo ingreses más abajo.
        </p>
        <p className="mb-8">
          Si el email no lo ves en tu bandeja de entrada, por favor, revisa tu carpeta de spam.
        </p>
        <Form method="post" className="mb-8">
          <input name="code" type="hidden" value={code} />
          <input name="timeLimit" type="hidden" value={timeLimit} />
          <div className="flex justify-center mb-8">
            <OTPInput
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={code}
              onChange={setCode}
              containerClassName="group flex items-center has-[:disabled]:opacity-30"
              render={({ slots }) => (
                <>
                  <div className="flex">
                    {slots.slice(0, 3).map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>

                  <FakeDash />

                  <div className="flex">
                    {slots.slice(3).map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>
                </>
              )}
            />
          </div>
          <div className="mb-10 mt-4">
            {timeLimit > 0 ? (
              <div className="text-center text-sm font-bold text-gray-400">
                Tienes {timeLimit} segundos para ingresar el código.
              </div>
            ) : (
              <div className="text-center text-sm font-bold text-red-500">
                Oh no, se acabó el tiempo. El código expiró y no se puede volver a utilizar. Por
                favor, presiona&nbsp;
                <Link
                  to={Page.LOGIN}
                  className="cursor-pointer text-[var(--o-text-primary-color)] hover:underline"
                >
                  aquí
                </Link>
                &nbsp;para que ingreses nuevamente tu email y recibirás un nuevo código.
              </div>
            )}
          </div>
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
        </Form>
        <div className="line rounded-md bg-slate-200 p-4 text-sm">
          Si el código no lo recibiste o tienes algún problema, por favor, presiona&nbsp;
          <Link
            to={Page.LOGIN}
            className="cursor-pointer text-[var(--o-text-primary-color)] hover:underline font-bold"
          >
            aquí
          </Link>
          &nbsp;para que ingreses nuevamente tu email y recibirás un nuevo código.
        </div>
      </>
    )
  )
}

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        'relative w-10 h-14 text-[2rem]',
        'flex items-center justify-center',
        'transition-all duration-300',
        'border-gray-500 border-y border-r first:border-l first:rounded-l-md last:rounded-r-md',
        'group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20',
        'outline outline-0 outline-accent-foreground/20',
        { 'outline-4 outline-accent-foreground': props.isActive },
      )}
    >
      <div className="group-has-[input[data-input-otp-placeholder-shown]]:opacity-20">
        {props.char ?? props.placeholderChar}
      </div>
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  )
}

function FakeCaret() {
  return (
    <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
      <div className="w-px h-8 bg-white" />
    </div>
  )
}

function FakeDash() {
  return (
    <div className="flex w-10 justify-center items-center">
      <div className="w-3 h-1 rounded-full bg-gray-400" />
    </div>
  )
}
