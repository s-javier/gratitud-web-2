import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { Page } from '~/enums'

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const title = String(formData.get('title'))
  console.log(title)
  return redirect(Page.GRATITUDE_MY_GRATITUDES)
}
