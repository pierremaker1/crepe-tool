import type { Metadata, Viewport } from 'next'
import './globals.css'
import PinGate from '@/components/PinGate'

export const metadata: Metadata = {
  title: 'Crêpe Tool',
  description: 'Prospection crêperies',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <PinGate>
          {children}
        </PinGate>
      </body>
    </html>
  )
}
