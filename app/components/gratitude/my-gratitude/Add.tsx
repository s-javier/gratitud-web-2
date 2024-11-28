import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useFetcher } from '@remix-run/react'
import { Button, Input, Textarea } from '@nextui-org/react'
import { toast } from 'sonner'

import { Api, ErrorTitle } from '~/enums'
import { useLoaderOverlayStore } from '~/stores'
import { cn } from '~/utils/cn'
import { gratitudeCreateValidation } from '~/utils/validations'
import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'

export default function MyGratitudeAdd(props: { userId: string }) {
  const setLoaderOverlay = useLoaderOverlayStore((state) => state.setLoaderOverlay)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [titleErrMsg, setTitleErrMsg] = useState('')
  const [description, setDescription] = useState('')
  const [descriptionErrMsg, setDescriptionErrMsg] = useState('')
  const [isClient, setIsClient] = useState(false)
  const fetcher = useFetcher<{
    isGratitudeCreated?: boolean
    errors?: {
      title?: string
      description?: string
      server?: { title: string; message: string }
    }
  }>()
  const formRef = useRef(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    setLoaderOverlay(fetcher.state !== 'idle')
    if (fetcher.state !== 'idle') {
      return
    }
    if (fetcher.data?.errors) {
      if (fetcher.data.errors.server === undefined) {
        setTitleErrMsg(fetcher.data.errors.title || '')
        setDescriptionErrMsg(fetcher.data.errors.description || '')
        toast.error(ErrorTitle.FORM_GENERIC, {
          description: 'Por favor corrige el formulario para agregar un agradecimiento.',
          duration: 5000,
        })
        return
      }
      if (fetcher.data.errors.server) {
        toast.error(fetcher.data.errors.server.title, {
          description: fetcher.data.errors.server.message || undefined,
          duration: 5000,
        })
        return
      }
    }
    if (fetcher.data?.isGratitudeCreated) {
      setIsDialogOpen(false)
    }
  }, [fetcher])

  return (
    <>
      <Button
        type="button"
        size="sm"
        className={cn(
          'w-full',
          'text-[var(--o-btn-primary-text-color)]',
          'bg-[var(--o-btn-primary-bg-color)]',
          'uppercase text-sm',
        )}
        onClick={() => setIsDialogOpen(true)}
      >
        Agregar
      </Button>
      {isClient &&
        createPortal(
          <Overlay type="dialog" width="max-w-[500px]" isActive={isDialogOpen}>
            <Dialog
              title="Nuevo agradecimiento"
              close={() => setIsDialogOpen(false)}
              footer={
                <>
                  <Button
                    type="button"
                    variant="faded"
                    className={cn(
                      '!text-gray-700 !border-gray-300 hover:!bg-gray-50',
                      'hover:!border-[var(--o-btn-cancel-border-hover-color)]',
                      'uppercase',
                    )}
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cerrar
                  </Button>
                  <Button
                    className={cn(
                      'text-[var(--o-btn-primary-text-color)]',
                      'bg-[var(--o-btn-primary-bg-color)]',
                      'uppercase',
                    )}
                    onClick={() => {
                      const validationErrors = gratitudeCreateValidation({
                        title: title || undefined,
                        description,
                      })
                      if (Object.keys(validationErrors.errors).length > 0) {
                        setTitleErrMsg(validationErrors.errors.title || '')
                        setDescriptionErrMsg(validationErrors.errors.description || '')
                        return
                      }
                      const formData = new FormData(formRef.current || undefined)
                      formData.append('userId', props.userId)
                      formData.append('isMaterialized', 'true')
                      fetcher.submit(formData, { method: 'post', action: Api.GRATITUDE_CREATE })
                      // fetcher.submit(formRef.current)
                    }}
                  >
                    Agregar
                  </Button>
                </>
              }
            >
              <div className="space-y-4 mb-8">
                <p className="">A continuación puedese agregar un agradecimiento.</p>
                <p className="text-sm text-gray-400">(*) Campos obligatorios.</p>
              </div>
              <fetcher.Form
                method="post"
                className="space-y-4"
                ref={formRef}
                action={Api.GRATITUDE_CREATE}
              >
                <Input
                  name="title"
                  type="text"
                  label="Título"
                  className=""
                  classNames={{
                    inputWrapper: [
                      'border-gray-400 border-[1px]',
                      'hover:!border-[var(--o-input-border-hover-color)]',
                      'group-data-[focus=true]:border-[var(--o-input-border-hover-color)]',
                    ],
                  }}
                  size="lg"
                  variant="bordered"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  isInvalid={titleErrMsg ? true : false}
                  errorMessage={titleErrMsg}
                  onFocus={() => setTitleErrMsg('')}
                />
                <Textarea
                  name="description"
                  type="text"
                  label="Descripción*"
                  className=""
                  classNames={{
                    inputWrapper: [
                      'border-gray-400 border-[1px]',
                      'hover:!border-[var(--o-input-border-hover-color)]',
                      'group-data-[focus=true]:border-[var(--o-input-border-hover-color)]',
                    ],
                  }}
                  size="lg"
                  variant="bordered"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  isInvalid={descriptionErrMsg ? true : false}
                  errorMessage={descriptionErrMsg}
                  onFocus={() => setDescriptionErrMsg('')}
                />
              </fetcher.Form>
              {/* 
            <TextField
              label="Descripción*"
              variant="outlined"
              multiline
              className="w-full"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: colors.gray[400],
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.pink[300],
                  },
                },
                '& label.Mui-focused': {
                  color: colors.pink[500],
                },
              }}
              value={description()}
              onChange={(e) => {
                setDescription(e.target.value)
              }}
              onFocus={() => {
                setDescriptionErrMsg('')
              }}
              error={descriptionErrMsg() !== ''}
              helperText={descriptionErrMsg()}
            /> */}
            </Dialog>
          </Overlay>,
          document.querySelector('body')!,
        )}
    </>
  )
}
