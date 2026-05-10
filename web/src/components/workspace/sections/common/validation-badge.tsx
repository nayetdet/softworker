'use client'

import type { ReactNode } from 'react'

type ValidationBadgeProps = {
  children: ReactNode
}

export function ValidationBadge({ children }: ValidationBadgeProps): React.JSX.Element {
  return (
    <span className="whitespace-nowrap rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
      {children}
    </span>
  )
}
