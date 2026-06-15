'use client'

export const dynamic = 'force-dynamic'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProspectInsert, ProspectUpdate } from '@/lib/types'
import ProspectForm from '@/components/ProspectForm'
import { useLang } from '@/components/LangContext'

export default function AddProspect() {
  const router = useRouter()
  const { t } = useLang()

  async function handleSubmit(data: ProspectInsert | ProspectUpdate) {
    const res = await fetch('/api/prospects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Erreur')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <div className="bg-gray-900 px-4 pt-12 pb-5 flex items-center gap-3">
        <Link href="/" className="text-gray-400 text-lg p-1 -ml-1">{t.back}</Link>
        <h1 className="text-white font-bold text-xl">{t.newProspect}</h1>
      </div>
      <div className="px-4 pt-5">
        <ProspectForm onSubmit={handleSubmit} isNew />
      </div>
    </div>
  )
}
