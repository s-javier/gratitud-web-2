import { useEffect, useState } from 'react'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import { OTPInput, REGEXP_ONLY_DIGITS, SlotProps } from 'input-otp'
import { Button } from '@nextui-org/react'
import * as v from 'valibot'
import { toast } from 'sonner'

import { cn } from '~/utils'
import { ActionFunctionArgs } from '@remix-run/node'

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
  return null
}

export default function Code() {
  const navigation = useNavigation()
  const fetcher = useActionData<typeof action>()
  const [timeLimit, setTimeLimit] = useState(300)
  const [code, setCode] = useState('')
  const [errCode, setErrCode] = useState('')

  useEffect(() => {
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
    if (navigation.state !== 'submitting' && fetcher?.errors) {
      if (fetcher.errors.server) {
        toast.error(fetcher.errors.server.title, {
          description: fetcher.errors.server.message || undefined,
          duration: 5000,
        })
      }
      if (fetcher.errors.code) {
        setErrCode(fetcher.errors.code)
      }
      // setErrServerTitle('Por favor corrige el código para ingresar')
      toast.error(fetcher.errors.code || 'Por favor corrige el código para ingresar', {
        duration: 5000,
      })
    }
  }, [fetcher])

  return (
    <>
      <p className="mb-4">¡Gracias por iniciar sesión en Condimento!</p>
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
              {/* <button
                onClick={() => {
                  props.continue(false)
                }}
                className="cursor-pointer text-yellow-500 hover:underline"
              >
                aquí
              </button> */}
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
        {/* <button
          onClick={() => {
            props.continue(false)
          }}
          className="cursor-pointer text-pink-400 hover:underline font-bold"
        >
          aquí
        </button> */}
        &nbsp;para que ingreses nuevamente tu email y recibirás un nuevo código.
      </div>
    </>
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
