import { Button } from '@nextui-org/react'

import { cn } from '~/utils/cn'
import Overlay from '~/components/shared/Overlay'
import Dialog from '~/components/shared/Dialog'

export default function GratitudeInfo(props: {
  isShow: boolean
  close: () => void
  data: { title: string; description: string }
}) {
  return (
    <Overlay type="dialog" isActive={props.isShow}>
      <Dialog
        title="Agradecimiento"
        close={props.close}
        footer={
          <Button
            type="button"
            variant="faded"
            className={cn(
              'm-auto',
              '!text-gray-700 !border-gray-300 hover:!bg-gray-50',
              'hover:!border-[var(--o-btn-cancel-border-hover-color)]',
              'uppercase',
            )}
            onClick={props.close}
          >
            Cerrar
          </Button>
        }
      >
        <div className="space-y-4">
          {props.data.title && <p className="font-bold text-lg">{props.data.title}</p>}
          <p>{props.data.description}</p>
        </div>
      </Dialog>
    </Overlay>
  )
}
