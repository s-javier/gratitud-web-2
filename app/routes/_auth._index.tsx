import { useEffect, useState } from 'react'
import type { MetaFunction } from '@remix-run/node'
import { useFetcher, useNavigate } from '@remix-run/react'
import { Button, Input } from '@nextui-org/react'
import { toast } from 'sonner'

import { Page } from '~/enums'
import { useIsCodeSentStore, useLoaderOverlayStore } from '~/stores'

export const meta: MetaFunction = () => {
  return [{ title: 'Ingreso | Gratitud' }, { name: 'description', content: '' }]
}

export default function AuthLoginRoute() {
  const fetcher = useFetcher<{
    isCodeSent?: boolean
    errors?: {
      email?: string
      server?: { title: string; message: string }
    }
  }>()
  const setLoaderOverlay = useLoaderOverlayStore((state) => state.setLoaderOverlay)
  const [emailErrMsg, setEmailErrMsg] = useState('')
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
        setEmailErrMsg(fetcher.data.errors.email)
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
    <fetcher.Form method="post" action="ingresar">
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
        isInvalid={emailErrMsg ? true : false}
        errorMessage={emailErrMsg}
        onFocus={() => setEmailErrMsg('')}
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
