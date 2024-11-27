import { ReactNode } from 'react'
import { Icon } from '@iconify/react'

import { cn } from '~/utils/cn'

export default function Dialog(props: {
  title: string
  close: () => void
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div
      className={cn(
        'o-dialog',
        'pointer-events-auto flex w-full flex-col overflow-hidden rounded-xl',
        'border bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800',
        'dark:shadow-neutral-700/70',
      )}
      style={{ maxHeight: 'calc(100vh - 32px)' }}
    >
      <header
        className={cn(
          'bg-[var(--o-dialog-header-bg-color)]',
          'flex items-center justify-between',
          'border-b px-4 py-3 dark:border-neutral-700',
        )}
      >
        <h3 id="hire-modal-label" className="text-lg font-semibold text-white">
          {props.title}
        </h3>
        <div className="min-w-12 flex flex-row justify-end">
          <button
            type="button"
            className={cn(
              'text-[var(--o-dialog-header-btn-close-text-color)]',
              'bg-[var(--o-dialog-header-btn-close-bg-color)]',
              'hover:bg-[var(--o-dialog-header-btn-close-bg-hover-color)]',
              'inline-flex size-8 items-center justify-center gap-x-2 rounded-full',
              'border border-transparent',
              'focus:outline-none',
              'disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-700',
              'dark:text-neutral-400 dark:hover:bg-neutral-600 dark:focus:bg-neutral-600',
            )}
            aria-label="Close"
            onClick={() => props.close()}
          >
            <span className="sr-only">Close</span>
            <Icon icon="mdi:close" width="100%" className="w-4" />
          </button>
        </div>
      </header>
      <main className="overflow-y-auto p-4 pb-8">{props.children}</main>
      <footer
        className={[
          'flex items-center justify-between gap-x-2 border-t px-4 py-3',
          'dark:border-neutral-700',
        ].join(' ')}
      >
        {props.footer}
      </footer>
    </div>
  )
}
