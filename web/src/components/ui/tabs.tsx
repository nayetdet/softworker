import { createContext, useContext, type ButtonHTMLAttributes, type HTMLAttributes, type ReactElement, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type TabsContextValue = {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext(): TabsContextValue {
  const context = useContext(TabsContext)

  if (!context) {
    throw new Error('Tabs components must be used within <Tabs>.')
  }

  return context
}

export function Tabs<T extends string>({
  children,
  className,
  onValueChange,
  value,
}: {
  children: ReactNode
  className?: string
  onValueChange: (value: T) => void
  value: T
}): ReactElement {
  return (
    <TabsContext.Provider value={{ value, onValueChange: onValueChange as (value: string) => void }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactElement {
  return (
    <div
      className={cn(
        'inline-flex h-10 items-stretch justify-center overflow-hidden rounded-full border border-border/70 bg-background/90 p-0.5 text-muted-foreground shadow-[inset_0_1px_2px_rgb(15_23_42/0.04)]',
        className,
      )}
      {...props}
    />
  )
}

export function TabsTrigger({
  children,
  className,
  value,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { value: string }): ReactElement {
  const context = useTabsContext()
  const active = context.value === value

  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-full w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-full border px-3 text-[0.9rem] font-semibold tracking-[-0.01em] transition-[background-color,color,border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        active
          ? 'border-primary/20 bg-primary/10 text-primary shadow-[inset_0_1px_0_rgb(255_255_255/0.7)]'
          : 'border-transparent bg-transparent text-muted-foreground hover:bg-background/80 hover:text-foreground',
        className,
      )}
      onClick={() => context.onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  )
}
