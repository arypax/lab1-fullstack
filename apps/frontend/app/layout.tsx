import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lab1 Frontend',
  description: 'Next.js App Router demo for Lab1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}


