'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Chat() {
  const [mensajes, setMensajes] = useState<any[]>([])
  const [texto, setTexto] = useState('')

  useEffect(() => {
    const fetchMensajes = async () => {
      const { data } = await supabase
        .from('mensajes')
        .select('*')
        .order('created_at', { ascending: true })
      if (data) setMensajes(data)
    }

    fetchMensajes()

    const channel = supabase
      .channel('chat')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'mensajes'
      }, (payload) => {
        setMensajes(prev => [...prev, payload.new])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const enviar = async () => {
    if (!texto.trim()) return
    await supabase.from('mensajes').insert({ contenido: texto })
    setTexto('')
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Chat</h1>
      <div className="border rounded-lg p-4 h-96 overflow-y-auto mb-4 flex flex-col gap-2">
        {mensajes.map((m) => (
          <div key={m.id} className="bg-gray-800 text-white rounded p-2">
            {m.contenido}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="border rounded p-2 flex-1"
          placeholder="Escribe un mensaje..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviar()}
        />
        <button onClick={enviar} className="bg-blue-600 text-white rounded px-4">
          Enviar
        </button>
      </div>
    </main>
  )
}