import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Providers } from '@/components/providers'
import localFont from 'next/font/local'

const isocpeur = localFont({
  src: '../public/fonts/ISOCPEUR.woff2',
  variable: '--font-isocpeur',
  display: 'swap',
  weight: '400',
})

export const metadata: Metadata = {
  title: 'DeltaProNet - Skills Database',
  description: 'A curated database of skilled engineers and professionals managed by DeltaProto',
  keywords: ['engineering', 'skills', 'professionals', 'R&D', 'DeltaProto'],
  authors: [{ name: 'DeltaProto' }],
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'DeltaProNet - Skills Database',
    description: 'A curated database of skilled engineers and professionals managed by DeltaProto',
    url: 'https://deltapronet.com',
    siteName: 'DeltaProNet',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${isocpeur.variable} font-sans`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}

