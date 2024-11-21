import Logo from '~/components/svg/Logo'
import UserMenu from '~/components/admin/UserMenu'

export default function AdminHeader(props: { title: any; buttons: any }) {
  return (
    <div className="bg-gray-800 pb-32">
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="border-b border-gray-700">
            <div className="flex h-16 items-center justify-between px-4 sm:px-0">
              <div className="flex items-center">
                <div className="lg:hidden">
                  {/* Mobile menu button */}
                  {/* <AdminMenu
                client:only="solid-js"
                menu={Astro.locals.menu ?? []}
                currentPath={Astro.url.pathname}
                organizations={Astro.locals.organizations}
              /> */}
                </div>
                <div className="hidden lg:block">
                  {
                    // Astro.locals.menu?.length >= 6 && (
                    //   <AdminMenu
                    //     client:only="solid-js"
                    //     menu={Astro.locals.menu ?? []}
                    //     currentPath={Astro.url.pathname}
                    //     organizations={Astro.locals.organizations}
                    //   />
                    // )
                  }
                </div>
                <a href="/admin/welcome" className="o-page ml-2">
                  {/* <Icon name="logo" width="100%" height="100%" className="w-[160px]" /> */}
                  <Logo className="w-[160px]" />
                </a>
                <div className="hidden lg:block">
                  <div className="ml-10 flex items-baseline space-x-1">
                    {
                      // Astro.locals.menu?.length < 6 &&
                      //   Astro.locals.menu.map((item: any) => (
                      //     <a
                      //       href={item.path}
                      //       class:list={[
                      //         'o-page',
                      //         'relative rounded-md',
                      //         Astro.url.pathname === item.path
                      //           ? 'text-white bg-white/5'
                      //           : 'text-gray-300 hover:text-white hover:bg-white/5',
                      //       ]}
                      //     >
                      //       <div className="px-3 py-2">{item.title}</div>
                      //       {Astro.url.pathname === item.path && (
                      //         <div
                      //           transition:name="menu-page"
                      //           class:list={[
                      //             'absolute left-0 top-0 w-full h-full rounded-md border-2',
                      //             'border-[var(--o-admin-menu-expanded-border-current-color)]',
                      //           ]}
                      //         />
                      //       )}
                      //     </a>
                      //   ))
                    }
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                {/* Notifications button */}
                {/* <button type="button" className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">View notifications</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                  </button> */}
                <div className="hidden sm:block">
                  {
                    // Astro.locals.organizations?.length > 1 && (
                    //   <OrganizationMenu
                    //     client:only="solid-js"
                    //     organizations={Astro.locals.organizations}
                    //   />
                    // )
                  }
                </div>
                <div className="relative ml-1">
                  {/* <UserMenu client:only="solid-js" name={Astro.locals.user?.name ?? 'Usuario'} /> */}
                  <UserMenu name={'Usuario'} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <header className="py-10">
        <div className="mx-auto flex max-w-7xl flex-row items-center justify-between px-4 sm:px-6 lg:px-8">
          {props.title}
          <div className="flex flex-row items-center gap-x-6">{props.buttons}</div>
        </div>
      </header>
    </div>
  )
}
