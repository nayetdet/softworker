import type { LabelHTMLAttributes } from 'react'
import type { ReactElement } from 'react'
import { cn } from '@/lib/utils'

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>): ReactElement {
  return <label className={cn('text-[0.9rem] font-medium leading-none', className)} {...props} />
}

