'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Prospect, ProspectInsert, ProspectUpdate } from '@/lib/types'
import ProspectForm from '@/components/ProspectForm'
import { useLang } from '@/components/LangContext'

export default function ProspectDetail() {
  const params = useParams()
  const router = useRouter()
  const { t } = useLang()
  const id = params.id as string

  const [prospect, setProspect] = useState<Prospect | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/prospects/${id}`)
        if (!res.ok) {
          setNotFound(true)
        } else {
          const json = await res.json()
          if (!json.data) setNotFound(true)
          else setProspect(json.data)
        }
      } catch {
        setNotFound(true)
      }
      setLoading(false)
    }
    load()
  }, [id])

  async function handleSubmit(data: ProspectInsert | ProspectUpdate) {
    const res = await fetch(`/api/prospects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Erreur')
    router.push('/')
  }

  async function handleDelete() {
    const res = await fetch(`/api/prospects/${id}`, { method: 'DELETE' })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Erreur')
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-400">{t.loading}</p>
    </div>
  )

  if (notFound || !prospect) return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500">{t.prospectNotFound}</p>
      <Link href="/" className="text-gray-900 underline">{t.goBack}</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <div className="bg-gray-900 px-4 pt-12 pb-5 flex items-center gap-3">
        <Link href="/" className="text-gray-400 text-lg p-1 -ml-1">{t.back}</Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-white font-bold text-xl truncate">{prospect.name}</h1>
          {prospect.city && <p className="text-gray-400 text-sm">{prospect.city}</p>}
        </div>
      </div>
      <div className="px-4 pt-5">
        <ProspectForm initialData={prospect} onSubmit={handleSubmit} onDelete={handleDelete} />
      </div>
    </div>
  )
}
