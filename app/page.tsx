import { supabase } from '@/lib/supabase'
import Catalogo from './components/Catalogo'

export default async function Home() {
  const { data: productos } = await supabase
    .from('productos')
    .select('*')

  return (
    <main className="max-w-6xl mx-auto">
      <div className="relative w-full h-64 bg-gray-800 flex flex-col items-center justify-center mb-12 rounded-b-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-700 opacity-90"/>
        <h1 className="relative text-5xl font-bold text-white mb-2">STOCK FORTRESS</h1>
        <p className="relative text-gray-300 text-lg">Welcome!</p>
      </div>
      <Catalogo productos={productos || []} />
    </main>
  )
}