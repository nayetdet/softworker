import type { ReactNode, SelectHTMLAttributes } from 'react'
import type { ReactElement } from 'react'
import { cn } from '@/lib/utils'

export function Select<T extends string>({
  children,
  className,
  onValueChange,
  value,
  ...props
}: Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> & {
  children: ReactNode
  onValueChange: (value: T) => void
  value: T
}): ReactElement {
  return (
    <div className="group relative rounded-xl border border-border/80 bg-card shadow-sm transition-[border-color,box-shadow] hover:border-border focus-within:border-border focus-within:ring-2 focus-within:ring-ring/20">
      <select
        value={value}
        className={cn(
          'flex h-11 w-full cursor-pointer appearance-none rounded-xl border-0 bg-transparent px-3.5 py-2.5 pr-11 text-[0.95rem] font-medium text-foreground outline-none transition-colors focus-visible:ring-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        onChange={(event): void => onValueChange(event.currentTarget.value as T)}
        {...props}
      >
        {children}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-3 inline-flex items-center text-muted-foreground transition-colors group-focus-within:text-foreground"
      >
        ▾
      </span>
    </div>
  )
}

