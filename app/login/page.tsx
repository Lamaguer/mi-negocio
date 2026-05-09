'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [paso, setPaso] = useState<'login' | 'rol'>('login')
  const [userId, setUserId] = useState('')

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else {
      setUserId(data.user.id)
      setPaso('rol')
    }
  }

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else {
      setUserId(data.user!.id)
      setPaso('rol')
    }
  }

  const elegirRol = async (rol: string) => {
    await supabase.from('perfiles').upsert({ id: userId, rol })
    window.location.href = rol === 'empleado' ? '/admin' : '/'
  }

  if (paso === 'rol') {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="border border-gray-700 rounded-lg p-8 w-96 shadow bg-gray-900">
          <h1 className="text-2xl font-bold mb-2 text-white">¿Cómo deseas entrar?</h1>
          <p className="text-gray-400 mb-6 text-sm">Selecciona tu rol para continuar</p>
          <button onClick={() => elegirRol('cliente')}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-3 w-full mb-3 font-bold">
            Soy cliente
          </button>
          <button onClick={() => elegirRol('empleado')}
            className="bg-gray-600 hover:bg-gray-700 text-white rounded-lg p-3 w-full font-bold">
            Soy empleado
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="border border-gray-700 rounded-lg p-8 w-96 shadow bg-gray-900">
        <h1 className="text-2xl font-bold mb-6 text-white">Iniciar sesión</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Correo"
          className="border border-gray-600 bg-gray-800 rounded p-2 w-full mb-4 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="border border-gray-600 bg-gray-800 rounded p-2 w-full mb-6 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded p-2 w-full mb-2">
          Entrar
        </button>
        <button onClick={handleRegister}
          className="bg-gray-600 hover:bg-gray-700 text-white rounded p-2 w-full">
          Registrarse
        </button>
      </div>
    </main>
  )
}