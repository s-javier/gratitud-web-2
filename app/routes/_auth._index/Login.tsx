import { Form, useFetcher } from '@remix-run/react'
import { Button, Input } from '@nextui-org/react'

export default function Login() {
  const fetcher = useFetcher()

  return (
    <fetcher.Form method="post">
      <Input size="lg" type="email" label="Email" variant="bordered" className="mb-6" />
      <Button
        type="submit"
        size="lg"
        className={[
          'w-full',
          'text-[var(--o-btn-primary-text-color)]',
          'bg-[var(--o-btn-primary-bg-color)]',
        ].join(' ')}
      >
        Ingresar
      </Button>
    </fetcher.Form>
  )
}
