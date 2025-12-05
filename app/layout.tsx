import type { Metadata } from 'next'
import './global.css'

export const metadata: Metadata = {
  title: 'CarFix - Your trusted car service',
  description: 'Connect with trusted mechanics, compare prices, and book your car service with confidence.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

