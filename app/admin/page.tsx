'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Admin() {
  const [productos, setProductos] = useState<any[]>([])
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [categoria, setCategoria] = useState('')
  const [imagenUrl, setImagenUrl] = useState('')
  const [mensaje, setMensaje] = useState('')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
    })
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    const { data } = await supabase.from('productos').select('*')
    if (data) setProductos(data)
  }

  const agregarProducto = async () => {
    if (!nombre || !precio) return setMensaje('Nombre y precio son obligatorios.')
const { error } = await supabase.from('productos').insert({
  nombre, descripcion, precio: parseFloat(precio),
  stock: parseInt(stock) || 0, categoria, imagen_url: imagenUrl
})
if (error) {
  console.log('Error:', error)
  setMensaje('Error al agregar producto.')
} else {
  console.log('Agregado correctamente')
  setMensaje('¡Producto agregado!')
  setNombre(''); setDescripcion(''); setPrecio('')
  setStock(''); setCategoria(''); setImagenUrl('')
  fetchProductos()
}
  }

  const eliminarProducto = async (id: string) => {
    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (!error) fetchProductos()
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Panel de administración</h1>

      {/* Formulario agregar */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-10">
        <h2 className="text-xl font-bold mb-4">Agregar producto</h2>
        {mensaje && <p className="text-green-400 mb-4">{mensaje}</p>}
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded p-2 text-white"/>
          <input placeholder="Categoría" value={categoria} onChange={e => setCategoria(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded p-2 text-white"/>
          <input placeholder="Precio" type="number" value={precio} onChange={e => setPrecio(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded p-2 text-white"/>
          <input placeholder="Stock" type="number" value={stock} onChange={e => setStock(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded p-2 text-white"/>
          <input placeholder="URL de imagen" value={imagenUrl} onChange={e => setImagenUrl(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded p-2 text-white col-span-2"/>
          <textarea placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded p-2 text-white col-span-2"/>
        </div>
        <button onClick={agregarProducto}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 font-bold">
          Agregar producto
        </button>
      </div>

      {/* Lista de productos */}
      <h2 className="text-xl font-bold mb-4">Productos existentes</h2>
      <div className="flex flex-col gap-4">
        {productos.map(p => (
          <div key={p.id} className="flex items-center gap-4 bg-gray-900 border border-gray-700 rounded-lg p-4">
            <img src={p.imagen_url} alt={p.nombre} className="w-16 h-16 object-cover rounded"/>
            <div className="flex-1">
              <p className="font-bold">{p.nombre}</p>
              <p className="text-gray-400 text-sm">{p.categoria} — ${p.precio} — Stock: {p.stock}</p>
            </div>
            <button onClick={() => eliminarProducto(p.id)}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-sm">
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}