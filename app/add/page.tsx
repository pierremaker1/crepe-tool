'use client'

export const dynamic = 'force-dynamic'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ProspectInsert, ProspectUpdate } from '@/lib/types'
import ProspectForm from '@/components/ProspectForm'

export default function AddProspect() {
  const router = useRouter()

  async function handleSubmit(data: ProspectInsert | ProspectUpdate) {
    const { error } = await supabase.from('prospects').insert([data as ProspectInsert])
    if (error) throw new Error(error.message)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <div className="bg-gray-900 px-4 pt-12 pb-5 flex items-center gap-3">
        <Link href="/" className="text-gray-400 text-lg p-1 -ml-1">←</Link>
        <h1 className="text-white font-bold text-xl">Nouveau prospect</h1>
      </div>
      <div className="px-4 pt-5">
        <ProspectForm onSubmit={handleSubmit} isNew />
      </div>
    </div>
  )
}
