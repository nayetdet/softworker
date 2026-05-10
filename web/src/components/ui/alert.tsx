import type { HTMLAttributes } from 'react'
import type { ReactElement } from 'react'
import { cn } from '@/lib/utils'

export function Alert({
  className,
  variant = 'default',
  ...props
}: HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'destructive' }): ReactElement {
  return (
    <div
      className={cn(
        'relative w-full rounded-lg border px-4 py-3 text-[0.92rem] leading-6',
        variant === 'destructive' ? 'border-destructive/30 bg-destructive/10 text-destructive' : 'bg-card text-card-foreground',
        className,
      )}
      {...props}
    />
  )
}

export function AlertTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>): ReactElement {
  return <h5 className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
}

export function AlertDescription({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactElement {
  return <div className={cn('text-[0.92rem] leading-6 [&_p]:leading-relaxed', className)} {...props} />
}

