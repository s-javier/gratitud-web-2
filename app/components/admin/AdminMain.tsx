import { type ReactNode } from 'react'

export default function AdminMain(props: { children: ReactNode }) {
  return (
    <main className="-mt-32 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">{props.children}</div>
      </div>
    </main>
  )
}
