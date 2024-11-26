import { useState } from 'react'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react'
import { Icon } from '@iconify/react'

import { Page } from '~/enums'
// import { $loaderOverlay } from '~/stores'
// import { validateResponse } from '~/utils'
import { useUserStore } from '~/stores'

export default function UserMenu() {
  const firstNameUser = useUserStore((state) => state.firstName)

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          variant="light"
          className="text-gray-400 text-base hover:text-white"
          startContent={<Icon icon="mdi:account" width="100%" className="w-5" />}
          endContent={<Icon icon="mdi:chevron-down" width="100%" className="w-5" />}
        >
          {firstNameUser}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem
          key="logout"
          startContent={<Icon icon="mdi:logout" width="100%" className="w-5 text-gray-500" />}
        >
          Cerrar sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
