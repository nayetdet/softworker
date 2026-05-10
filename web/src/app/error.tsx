'use client'

import { useEffect } from 'react'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps): React.JSX.Element {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
        <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-foreground">
          Não foi possível carregar a página
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Ocorreu um erro inesperado. Tente novamente para recarregar a aplicação.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Tentar novamente
        </button>
      </div>
    </main>
  )
}
