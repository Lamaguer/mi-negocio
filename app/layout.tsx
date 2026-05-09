import type { Metadata } from 'next'
import './globals.css'
import Nav from './components/Nav'
export const metadata: Metadata = {
  title: 'STOCK FORTRESS',
  description: 'Tienda en línea',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-gray-950 text-white min-h-screen">
        <Nav />

        {children}
        <footer className="bg-gray-900 border-t border-gray-700 text-center text-gray-400 py-6 mt-12">
          <p className="text-sm">© 2026 Stock Fortress — Todos los derechos reservados a FIME creo</p>
        </footer>
      </body>
    </html>
  )
}