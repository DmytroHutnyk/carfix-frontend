import type { Metadata } from 'next'
import '@/styles/global.css'
import Providers from "@/util/providers/providers";


export const metadata: Metadata = {
  title: 'CarFix',
  description: 'Connect with trusted mechanics, compare prices, and book your car service with confidence.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

