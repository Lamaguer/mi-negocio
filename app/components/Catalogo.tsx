'use client'
import { useState } from 'react'

export default function Catalogo({ productos }: { productos: any[] }) {
  const [busqueda, setBusqueda] = useState('')

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria?.toLowerCase().includes(busqueda.toLowerCase())
  )

  const categorias = [...new Set(productosFiltrados.map(p => p.categoria))]

  return (
    <div className="px-8 pb-12">
      <input
        type="text"
        placeholder="Search..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="border border-gray-600 bg-gray-800 text-white rounded-lg p-3 w-full mb-10 focus:outline-none focus:border-blue-500"
      />

      {productosFiltrados.length === 0 && (
        <p className="text-gray-400 text-center mt-12 text-lg">No products found.</p>
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
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}