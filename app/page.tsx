'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'
import { Prospect, ProspectStatus, STATUS_DOT_COLORS } from '@/lib/types'
import ProspectCard from '@/components/ProspectCard'
import { isToday } from '@/lib/utils'
import { useLang } from '@/components/LangContext'

const STATUS_ORDER: ProspectStatus[] = ['to_follow_up', 'meeting_booked', 'to_visit', 'client', 'not_interested']

export default function Dashboard() {
  const { t, lang, toggle } = useLang()
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProspects()
  }, [])

  async function fetchProspects() {
    setLoading(true)
    try {
      const { data, error } = await getSupabase()
        .from('prospects')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Supabase query error:', error)
        setError(`Erreur : ${error.message}`)
      } else {
        setProspects(data || [])
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('Fetch error:', msg)
      setError(`Erreur : ${msg}`)
    }
    setLoading(false)
  }

  const todayProspects = prospects.filter(p => isToday(p.visit_date))
  const toFollowUp = prospects.filter(p => p.status === 'to_follow_up').length
  const meetingsBooked = prospects.filter(p => p.status === 'meeting_booked').length

  const grouped = STATUS_ORDER.reduce((acc, status) => {
    const items = prospects.filter(p => p.status === status)
    if (items.length > 0) acc[status] = items
    return acc
  }, {} as Record<string, Prospect[]>)

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="bg-gray-900 px-4 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold">🥞 {t.appName}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{t.dashboard}</p>
          </div>
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 px-3 py-1.5 rounded-xl text-sm font-medium text-gray-200 transition-colors"
          >
            <span className="text-base">{lang === 'fr' ? '🇬🇧' : '🇫🇷'}</span>
            <span>{lang === 'fr' ? 'EN' : 'FR'}</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-5">
          <StatCard label={t.totalProspects} value={prospects.length} color="text-white" />
          <StatCard label={t.visitsToday} value={todayProspects.length} color="text-green-400" />
          <StatCard label={t.toFollowUp} value={toFollowUp} color="text-orange-400" />
          <StatCard label={t.meetingsBooked} value={meetingsBooked} color="text-green-400" />
        </div>
      </div>

      <div className="px-4 mt-4">
        {loading && (
          <div className="text-center py-12 text-gray-400">{t.loading}</div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm mb-4">
            {error}
          </div>
        )}

        {todayProspects.length > 0 && (
          <section className="mb-6">
            <SectionHeader label={t.visitsTodaySection} count={todayProspects.length} dot="bg-green-500" />
            <div className="flex flex-col gap-3">
              {todayProspects.map(p => <ProspectCard key={p.id} prospect={p} />)}
            </div>
          </section>
        )}

        {!loading && Object.entries(grouped).map(([status, items]) => (
          <section key={status} className="mb-6">
            <SectionHeader
              label={t.status[status as ProspectStatus]}
              count={items.length}
              dot={STATUS_DOT_COLORS[status as ProspectStatus]}
            />
            <div className="flex flex-col gap-3">
              {items.map(p => <ProspectCard key={p.id} prospect={p} />)}
            </div>
          </section>
        ))}

        {!loading && prospects.length === 0 && !error && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🗺️</p>
            <p className="text-gray-500 font-medium">{t.noProspects}</p>
            <p className="text-gray-400 text-sm mt-1">{t.noProspectsHint}</p>
          </div>
        )}
      </div>

      <Link href="/add">
        <button className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 rounded-full shadow-lg flex items-center justify-center text-white text-2xl active:bg-gray-700 transition-colors z-10">
          +
        </button>
      </Link>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-gray-800 rounded-2xl p-4">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-gray-400 text-xs mt-0.5">{label}</p>
    </div>
  )
}

function SectionHeader({ label, count, dot }: { label: string; count: number; dot: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className={`w-2.5 h-2.5 rounded-full ${dot}`} />
      <h2 className="font-semibold text-gray-700 text-sm">{label}</h2>
      <span className="text-gray-400 text-xs">({count})</span>
    </div>
  )
}
