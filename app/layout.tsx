import type { Metadata } from 'next'
import './globals.css'

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
        <nav className="bg-gray-900 border-b border-gray-700 px-8 py-4 flex justify-between items-center">
          <span className="text-xl font-bold text-white">STOCK FORTRESS</span>
          <div className="flex gap-6">
            <a href="/about" className="hover:text-blue-400 transition">About Us</a>
            <a href="/" className="hover:text-blue-400 transition">Shop</a>
            <a href="/admin" className="hover:text-blue-400 transition">Admin</a>
            <a href="/chat" className="hover:text-blue-400 transition">Chat</a>
            <a href="/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-lg transition">Login</a>
          </div>
        </nav>
        {children}
        <footer className="bg-gray-900 border-t border-gray-700 text-center text-gray-400 py-6 mt-12">
          <p className="text-sm">© 2026 Stock Fortress — Todos los derechos reservados a FIME creo</p>
        </footer>
      </body>
    </html>
  )
}