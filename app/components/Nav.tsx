'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

import { supabase } from '@/lib/supabase'

export default function Nav() {
  const [esEmpleado, setEsEmpleado] = useState(false)

  useEffect(() => {
    const checkRol = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', session.user.id)
        .single()
      if (data?.rol === 'empleado') setEsEmpleado(true)
    }
    checkRol()
  }, [])

  return (
    <nav className="bg-gray-900 border-b border-gray-700 px-8 py-4 flex justify-between items-center">
      <span className="text-xl font-bold text-white">Papeleria Fortress</span>
      <div className="flex gap-6">
        <a href="/" className="hover:text-blue-400 transition">Inicio</a>
        <a href="/about" className="hover:text-blue-400 transition">About Us</a>
        <a href="/chat" className="hover:text-blue-400 transition">Chat</a>
        {esEmpleado && (
          <>
    <a href="/admin" className="hover:text-blue-400 transition">Admin</a>
    <a href="/ventas" className="hover:text-blue-400 transition">Ventas</a>
  </>
        )}
        <a href="/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-lg transition">Login</a>
      </div>
    </nav>
  )
}