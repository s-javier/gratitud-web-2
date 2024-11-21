import { useState } from 'react'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react'
import { Icon } from '@iconify/react'

import { Page } from '~/enums'
// import { $loaderOverlay } from '~/stores'
// import { validateResponse } from '~/utils'

export default function UserMenu(props: { name: string }) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">{props.name}</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="new">New file</DropdownItem>
        <DropdownItem key="copy">Copy link</DropdownItem>
        <DropdownItem key="edit">Edit file</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete file
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
