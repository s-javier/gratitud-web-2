import { useEffect, useState } from 'react'
// import { IconButton } from '@suid/material'
import { Icon } from '@iconify/react'

// import { $loaderBar } from '~/stores'
import Overlay from '~/components/shared/Overlay'
import { cn } from '~/utils/cn'

export default function AdminMenu(props: {
  menu: any[]
  currentPath: string
  organizations: any[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [openItems, setOpenItems] = useState<any>({})
  const [pages, setPages] = useState<any[]>([])

  const getPrefix = (path: string) => {
    const parts = path.split('/')
    return parts.slice(0, 3).join('/')
  }

  useEffect(() => {
    const groupedData: any = []
    const sections: any = {}
    for (const item of props.menu) {
      const prefix = getPrefix(item.path)
      if (sections[prefix]) {
        /* Si el prefijo ya existe, añadimos a los children */
        sections[prefix].children.push({
          path: item.path,
          menuTitle: item.title,
          menuIcon: item.icon,
        })
      } else {
        /* Si no existe, creamos un nuevo grupo o agregamos directamente al resultado */
        if (props.menu.filter((el: any) => getPrefix(el.path) === prefix).length > 1) {
          sections[prefix] = {
            prefix,
            menuTitle: item.title,
            menuIcon: item.icon,
            children: [
              {
                path: item.path,
                menuTitle: 'Ver ' + item.title.toLowerCase(),
                menuIcon: item.icon,
              },
            ],
          }
          groupedData.push(sections[prefix])
        } else {
          groupedData.push(item)
        }
      }
    }
    setPages(groupedData)
  })

  // @ts-ignore
  const toggleItem = (name, isRelationWithCurrentPath) => {
    setOpenItems((prev: any) => ({
      ...prev,
      /* Si isRelationWithCurrentPath === false, entonce es un toggle (ir variando) de !prev[name]
       * Si isRelationWithCurrentPath === true y prev[name] (=== undefined) es primera vez que se presiona,
       * entonces es false, sino es un toggle (ir variando) de !prev[name].
       */
      [name]: isRelationWithCurrentPath
        ? prev[name] === undefined
          ? false
          : !prev[name]
        : !prev[name],
    }))
  }

  const activeLoaderBar = () => {
    // $loaderBar.set(true)
  }

  return (
    <>
      {/* <IconButton
        className="!text-gray-400 hover:!text-white"
        onClick={() => setIsOpen(true)}
        aria-label="menu"
      >
        <Icon icon="mdi:menu" width="100%" className="w-6" />
      </IconButton> */}
      <Overlay
        type="sidebar"
        width="!w-[350px]"
        isActive={isOpen}
        zIndex="z-[1400]"
        close={() => setIsOpen(false)}
        panelTitle={props.organizations.filter((item: any) => item.isSelected)[0].title}
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white">
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="space-y-1">
                  {pages.map((item: any) => (
                    <li key={item.path}>
                      {!item.children ? (
                        <a
                          href={item.path}
                          className={cn(
                            props.currentPath === item.path && 'bg-[--o-admin-menu-item-bg-color]',
                            props.currentPath !== item.path && 'hover:bg-gray-50',
                            'group flex gap-x-3 rounded-md p-2 text-sm font-semibold',
                            'leading-6 text-gray-700',
                          )}
                          onClick={activeLoaderBar}
                        >
                          <Icon icon={item.icon} width="100%" className="w-5 text-gray-400" />
                          {item.title}
                        </a>
                      ) : (
                        <div>
                          <button
                            onClick={() =>
                              toggleItem(item.menuTitle, props.currentPath.includes(item.prefix))
                            }
                            className={cn(
                              // props.currentPath.includes(item.prefix) && 'bg-yellow-50',
                              // !props.currentPath.includes(item.prefix) && 'hover:bg-yellow-50',
                              'group flex w-full items-center gap-x-3 rounded-md p-2',
                              'text-left text-sm font-semibold leading-6 text-gray-700',
                            )}
                          >
                            <Icon icon={item.menuIcon} width="100%" className="w-5 text-gray-400" />
                            {item.menuTitle}
                            <Icon
                              icon="mdi:chevron-right"
                              width="100%"
                              className={cn(
                                'ml-auto h-5 w-5 shrink-0 text-gray-400 transition-transform',
                                (openItems()[item.menuTitle] ||
                                  (openItems()[item.menuTitle] === undefined &&
                                    props.currentPath.includes(item.prefix))) &&
                                  'rotate-90 text-gray-500',
                              )}
                            />
                          </button>
                          {openItems()[item.menuTitle] ||
                            (openItems()[item.menuTitle] === undefined &&
                              props.currentPath.includes(item.prefix) && (
                                <ul className="mt-1 px-2">
                                  {item.children.map((subItem: any) => (
                                    <li key={subItem.path}>
                                      <a
                                        href={subItem.path}
                                        className={cn(
                                          props.currentPath === subItem.path &&
                                            'bg-[--o-admin-menu-item-bg-color]',
                                          props.currentPath !== subItem.path && 'hover:bg-gray-50',
                                          'block rounded-md py-2 pl-9 pr-2 text-sm leading-6 text-gray-700',
                                        )}
                                        onClick={activeLoaderBar}
                                      >
                                        {subItem.menuTitle}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </Overlay>
    </>
  )
}
