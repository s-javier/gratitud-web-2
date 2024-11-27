import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button, Input } from '@nextui-org/react'

import { cn } from '~/utils/cn'
import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'
import { useFetcher } from '@remix-run/react'

export default function Add(props: any) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  // const [title, setTitle] = useState('')
  const [titleErrMsg, setTitleErrMsg] = useState('')
  const [description, setDescription] = useState('')
  const [descriptionErrMsg, setDescriptionErrMsg] = useState('')
  const [isClient, setIsClient] = useState(false)
  const fetcher = useFetcher<{
    // isCodeSent?: boolean
    // errors?: {
    //   email?: string
    //   server?: { title: string; message: string }
    // }
  }>()
  const formRef = useRef(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Cerrar modal
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
                    onClick={async () => {
                      fetcher.submit(formRef.current)
                      // if (validateRequest() === false) {
                      //   return
                      // }
                      // $loaderOverlay.set(true)
                      // const { data, error }: any = await actions.gratitudeCreate({
                      //   title: title().trim() || undefined,
                      //   description: description().trim(),
                      //   isMaterialized: true,
                      // })
                      // if (validateResponse(error || data?.error || null) === false) {
                      //   $loaderOverlay.set(false)
                      //   return
                      // }
                      // handleResponse()
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
              <fetcher.Form method="post" className="space-y-4" ref={formRef} action="agregar">
                <Input
                  name="title"
                  type="text"
                  label="Título"
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
                  isInvalid={titleErrMsg ? true : false}
                  errorMessage={titleErrMsg}
                  onFocus={() => setTitleErrMsg('')}
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
