'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Catalogo({ productos }: { productos: any[] }) {
  const [busqueda, setBusqueda] = useState('')
  const [carrito, setCarrito] = useState<any[]>([])
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [checkout, setCheckout] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
    })
  }, [])

  const agregarAlCarrito = (producto: any) => {
    setCarrito(prev => {
      const existe = prev.find(p => p.id === producto.id)
      if (existe) return prev.map(p => p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p)
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }

  const eliminarDelCarrito = (id: string) => {
    setCarrito(prev => prev.filter(p => p.id !== id))
  }

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0)

  const handleCheckout = () => {
    setCheckout(true)
    setTimeout(() => {
      setCarrito([])
      setCheckout(false)
      setCarritoAbierto(false)
      alert('¡Compra realizada con éxito! Gracias por tu pedido.')
    }, 2000)
  }

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria?.toLowerCase().includes(busqueda.toLowerCase())
  )

  const categorias = [...new Set(productosFiltrados.map(p => p.categoria))]

  return (
    <div className="px-8 pb-12">
      {/* Botón carrito flotante */}
      <button
        onClick={() => setCarritoAbierto(true)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-2xl z-50"
      >
        🛒
        {carrito.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {carrito.reduce((acc, p) => acc + p.cantidad, 0)}
          </span>
        )}
      </button>

      {/* Panel del carrito */}
      {carritoAbierto && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setCarritoAbierto(false)}/>
          <div className="relative bg-gray-900 w-96 h-full p-6 flex flex-col overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Tu carrito</h2>
            {carrito.length === 0 ? (
              <p className="text-gray-400">El carrito está vacío.</p>
            ) : (
              <>
                {carrito.map(p => (
                  <div key={p.id} className="flex items-center gap-4 mb-4 border-b border-gray-700 pb-4">
                    <img src={p.imagen_url} alt={p.nombre} className="w-16 h-16 object-cover rounded"/>
                    <div className="flex-1">
                      <p className="font-bold">{p.nombre}</p>
                      <p className="text-gray-400 text-sm">x{p.cantidad} — ${p.precio * p.cantidad}</p>
                    </div>
                    <button onClick={() => eliminarDelCarrito(p.id)} className="text-red-500 hover:text-red-400">✕</button>
                  </div>
                ))}
                <div className="mt-auto">
                  <p className="text-xl font-bold mb-4">Total: ${total.toFixed(2)}</p>
                  <button
                    onClick={handleCheckout}
                    disabled={checkout}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-3 w-full font-bold disabled:opacity-50"
                  >
                    {checkout ? 'Procesando...' : 'Checkout'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar productos..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="border border-gray-600 bg-gray-800 text-white rounded-lg p-3 w-full mb-10 focus:outline-none focus:border-blue-500"
      />

      {productosFiltrados.length === 0 && (
        <p className="text-gray-400 text-center mt-12 text-lg">No se encontraron productos.</p>
      )}

      {categorias.map((categoria) => (
        <div key={categoria} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">{categoria}</h2>
          <div className="grid grid-cols-3 gap-6">
            {productosFiltrados.filter(p => p.categoria === categoria).map((producto) => (
              <div key={producto.id} className="border border-gray-700 rounded-lg p-4 shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-200 bg-gray-900">
                <div className="relative">
                  <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-40 object-cover rounded mb-4"/>
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {producto.categoria}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{producto.nombre}</h2>
                <p className="text-gray-400 text-sm mb-2">{producto.descripcion}</p>
                <p className="text-green-500 font-bold text-lg">${producto.precio}</p>
                <p className={`text-sm mt-1 ${producto.stock > 0 ? 'text-blue-400' : 'text-red-500'}`}>
                  {producto.stock > 0 ? `Stock: ${producto.stock} disponibles` : 'Sin stock'}
                </p>
                <button
                  onClick={() => agregarAlCarrito(producto)}
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2 w-full text-sm"
                >
                  Agregar al carrito
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}