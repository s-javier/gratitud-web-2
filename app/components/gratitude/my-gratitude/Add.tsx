import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@nextui-org/react'

import { cn } from '~/utils/cn'
import AddEdit from './AddEdit'

export default function GratitudeMyAdd(props: { userId: string }) {
  const [isClient, setIsClient] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

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
          <AddEdit
            type="add"
            isShow={isDialogOpen}
            close={() => setIsDialogOpen(false)}
            userId={props.userId}
          />,
          document.querySelector('body')!,
        )}
    </>
  )
}
