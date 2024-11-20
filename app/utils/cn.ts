import { clsx } from 'clsx'
// @ts-ignore
import { twMerge } from 'tailwind-merge'

import type { ClassValue } from 'clsx'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}
