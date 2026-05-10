import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'SoftWorker',
    template: '%s | SoftWorker',
  },
  description: 'Editor de currículos ATS-friendly com visualização e exportação em PDF.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
