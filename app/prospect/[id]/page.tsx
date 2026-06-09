'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'
import { Prospect, ProspectInsert, ProspectUpdate } from '@/lib/types'
import ProspectForm from '@/components/ProspectForm'

export default function ProspectDetail() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [prospect, setProspect] = useState<Prospect | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await getSupabase()
          .from('prospects')
          .select('*')
          .eq('id', id)
          .single()

        if (error || !data) {
          setNotFound(true)
        } else {
          setProspect(data)
        }
      } catch {
        setNotFound(true)
      }
      setLoading(false)
    }
    load()
  }, [id])

  async function handleSubmit(data: ProspectInsert | ProspectUpdate) {
    const { error } = await getSupabase()
      .from('prospects')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw new Error(error.message)
    router.push('/')
  }

  async function handleDelete() {
    const { error } = await getSupabase().from('prospects').delete().eq('id', id)
    if (error) throw new Error(error.message)
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">Chargement...</p>
      </div>
    )
  }

  if (notFound || !prospect) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Prospect introuvable</p>
        <Link href="/" className="text-gray-900 underline">Retour</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <div className="bg-gray-900 px-4 pt-12 pb-5 flex items-center gap-3">
        <Link href="/" className="text-gray-400 text-lg p-1 -ml-1">←</Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-white font-bold text-xl truncate">{prospect.name}</h1>
          {prospect.city && <p className="text-gray-400 text-sm">{prospect.city}</p>}
        </div>
      </div>
      <div className="px-4 pt-5">
        <ProspectForm
          initialData={prospect}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
