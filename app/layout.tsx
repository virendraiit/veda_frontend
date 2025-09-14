import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import './fonts.css'
import { ReduxProvider } from '@/components/providers/ReduxProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { LoadingProvider } from '@/components/providers/LoadingProvider'
import { LanguageInitializer } from '@/components/language-initializer'

export const metadata: Metadata = {
  title: 'Veda-Shikshak Sahachar',
  description: 'AI-Powered Educational Platform',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Century+Gothic:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ReduxProvider>
          <AuthProvider>
            <LoadingProvider>
              <LanguageInitializer />
              {children}
            </LoadingProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
