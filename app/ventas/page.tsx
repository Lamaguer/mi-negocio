'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { supabase } from '@/lib/supabase'

export default function Ventas() {
  const [ventas, setVentas] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return router.push('/login')
      const { data } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', session.user.id)
        .single()
      if (data?.rol !== 'empleado') return router.push('/')
      
      const { data: ventasData, error } = await supabase
        .from('ventas')
        .select('*')
        .order('created_at', { ascending: false })
      
      console.log('ventas:', ventasData, 'error:', error)
      
      if (ventasData) {
        setVentas(ventasData)
        setTotal(ventasData.reduce((acc, v) => acc + v.total, 0))
      }
    }
    init()
  }, [])

  const fetchVentas = async () => {
    const { data } = await supabase
      .from('ventas')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) {
      setVentas(data)
      setTotal(data.reduce((acc, v) => acc + v.total, 0))
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Registro de ventas</h1>
      <p className="text-gray-400 mb-8">Total recaudado: <span className="text-green-400 font-bold text-xl">${total.toFixed(2)}</span></p>

      {ventas.length === 0 ? (
        <p className="text-gray-400">No hay ventas registradas aún.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {ventas.map(v => (
            <div key={v.id} className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-white">{v.producto_nombre}</p>
                <p className="text-gray-400 text-sm">
                  Cantidad: {v.cantidad} — {new Date(v.created_at).toLocaleString('es-MX')}
                </p>
              </div>
              <p className="text-green-400 font-bold text-lg">${v.total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}