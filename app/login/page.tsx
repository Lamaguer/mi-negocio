'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else router.push('/')
  }

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else router.push('/')
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="border rounded-lg p-8 w-96 shadow">
        <h1 className="text-2xl font-bold mb-6">Iniciar sesión</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Correo"
          className="border rounded p-2 w-full mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="border rounded p-2 w-full mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} className="bg-blue-600 text-white rounded p-2 w-full mb-2">
          Entrar
        </button>
        <button onClick={handleRegister} className="bg-gray-600 text-white rounded p-2 w-full">
          Registrarse
        </button>
      </div>
    </main>
  )
}