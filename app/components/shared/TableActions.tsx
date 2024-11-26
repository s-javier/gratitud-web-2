import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { Icon } from '@iconify/react'

export default function TableActions(props: {
  infoClick?: () => void
  editClick?: () => void
  deleteClick?: () => void
}) {
  return (
    <div className="flex flex-row justify-end">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button isIconOnly aria-label="Actions" variant="light">
            <Icon
              icon="mdi:more-vert"
              width="100%"
              className="w-6 !text-gray-400 hover:!text-[var(--o-btn-filter-text-hover-color)]"
            />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <>
            {props.infoClick && (
              <DropdownItem
                key="info"
                startContent={
                  <Icon icon="mdi:remove-red-eye" width="100%" className="w-6 text-blue-500" />
                }
                onClick={async () => {
                  props.infoClick!()
                }}
              >
                Ver
              </DropdownItem>
            )}
            {props.infoClick && (
              <DropdownItem
                key="edit"
                startContent={<Icon icon="mdi:edit" width="100%" className="w-6 text-green-500" />}
                onClick={async () => {
                  props.editClick!()
                }}
              >
                Editar
              </DropdownItem>
            )}
            {props.deleteClick && (
              <DropdownItem
                key="delete"
                startContent={<Icon icon="mdi:trash" width="100%" className="w-6 text-red-500" />}
                onClick={async () => {
                  props.deleteClick!()
                }}
              >
                Eliminar
              </DropdownItem>
            )}
          </>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
