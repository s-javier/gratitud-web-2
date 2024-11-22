import { type ReactNode, useEffect, useRef, useState } from 'react'
import { animate } from 'motion'

import { cn } from '~/utils/cn'

export default function Overlay(props: {
  isActive: boolean
  children: ReactNode
  type: 'dialog' | 'sidebar'
  width?: string
  zIndex?: string
  close?: () => void
  panelTitle?: string
}) {
  const overlayBackdropRef = useRef<HTMLDivElement>(null)
  const overlayDialogRef = useRef<HTMLDivElement>(null)
  const overlaySidebarRef = useRef<HTMLDivElement>(null)
  const [is, setIs] = useState(false)

  const openOverlay = () => {
    animate(overlayBackdropRef.current!, { opacity: 1 }, { duration: 0.3 })
    if (props.type === 'dialog') {
      animate(
        overlayDialogRef.current!,
        { transform: 'translateY(0px)', opacity: 1 },
        { duration: 0.3 },
      )
    } else {
      animate(overlaySidebarRef.current!, { transform: 'translateX(0px)' }, { duration: 0.3 })
    }
  }

  const closeOverlay = async () => {
    if (props.type === 'dialog') {
      await animate([
        [overlayBackdropRef.current!, { opacity: 0 }, { duration: 0.2 }],
        [
          overlayDialogRef.current!,
          { transform: 'translateY(-200px)', opacity: 0 },
          { at: '<', duration: 0.2 },
        ],
      ])
    } else {
      await animate([
        [overlaySidebarRef.current!, { transform: 'translateX(100%)' }, { duration: 0.3 }],
        [overlayBackdropRef.current!, { opacity: 0 }, { at: 0.1, duration: 0.2 }],
      ])
    }
  }

  useEffect(() => {
    const effect = async () => {
      if (props.isActive) {
        setIs(true)
        openOverlay()
      } else {
        await closeOverlay()
        setIs(false)
      }
    }
    effect()
  }, [props.isActive])

  return (
    <div
      className={cn('relative', props.zIndex ?? 'z-[1400]', is ? '' : 'hidden')}
      aria-labelledby="Elemento para mostrar que está cargando"
      aria-modal="true"
    >
      <div
        // @ts-ignore
        ref={overlayBackdropRef}
        className="fixed inset-0 bg-gray-500 bg-opacity-75 opacity-0"
        aria-hidden="true"
        // in:backdropTransition={{ duration: 300 }}
        // out:backdropTransition={{ duration: 200 }}
      ></div>

      {props.type === 'dialog' ? (
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div
              // @ts-ignore
              ref={overlayDialogRef}
              className={cn(
                'relative overflow-hidden rounded-lg text-left',
                'w-full',
                props.width ?? 'sm:max-w-sm',
                'transform translate-y-[-200px]',
                'opacity-0',
                is ? '' : 'hidden',
              )}
              // in:contentTransition={{ duration: 300 }}
              // out:contentTransition={{ duration: 200 }}
            >
              {/* ↓ Contenedor de modal, no del contenido */}
              <main className="flex flex-row items-center justify-center">{props.children}</main>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              {/* Slide-over panel, show/hide based on slide-over state.

          Entering: "transform transition ease-in-out duration-500 sm:duration-700"
            From: "translate-x-full"
            To: "translate-x-0"
          Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
            From: "translate-x-0"
            To: "translate-x-full" */}
              <div
                // @ts-ignore
                ref={overlaySidebarRef}
                className={cn(
                  'pointer-events-auto w-screen',
                  props.width ?? 'max-w-md',
                  is ? '' : 'hidden',
                  'transform translate-x-full',
                )}
                // className={[
                //   'relative overflow-hidden rounded-lg text-left',
                //   'w-full',
                //   props.width ?? 'sm:max-w-sm',
                //   'transform translate-y-[-200px]',
                //   'opacity-0',
                //   is ? '' : 'hidden',
                // ].join(' ')}
              >
                <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2
                        className="text-base font-semibold leading-6 text-gray-900"
                        id="slide-over-title"
                      >
                        {props.panelTitle}
                      </h2>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          onClick={props.close}
                        >
                          <span className="absolute -inset-2.5"></span>
                          <span className="sr-only">Close panel</span>
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6">{props.children}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
