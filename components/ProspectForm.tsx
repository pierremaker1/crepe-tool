'use client'

import { useState } from 'react'
import { Prospect, ProspectInsert, ProspectUpdate, ProspectStatus, WebsiteStatus, ALL_STATUSES, STATUS_COLORS } from '@/lib/types'
import { todayISO } from '@/lib/utils'
import { useLang } from './LangContext'

interface ProspectFormProps {
  initialData?: Partial<Prospect>
  onSubmit: (data: ProspectInsert | ProspectUpdate) => Promise<void>
  onDelete?: () => Promise<void>
  isNew?: boolean
}

export default function ProspectForm({ initialData, onSubmit, onDelete, isNew }: ProspectFormProps) {
  const { t } = useLang()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    owner: initialData?.owner ?? '',
    address: initialData?.address ?? '',
    city: initialData?.city ?? '',
    phone: initialData?.phone ?? '',
    google_reviews: initialData?.google_reviews?.toString() ?? '',
    google_rating: initialData?.google_rating?.toString() ?? '',
    website_status: (initialData?.website_status ?? 'none') as WebsiteStatus,
    status: (initialData?.status ?? 'to_visit') as ProspectStatus,
    visit_date: initialData?.visit_date ?? '',
    visit_notes: initialData?.visit_notes ?? '',
    pitch_argument: initialData?.pitch_argument ?? '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError(t.nameRequired); return }
    setSaving(true)
    setError(null)
    try {
      const payload: ProspectInsert = {
        name: form.name.trim(),
        owner: form.owner.trim() || null,
        address: form.address.trim() || null,
        city: form.city.trim() || null,
        phone: form.phone.trim() || null,
        google_reviews: form.google_reviews ? parseInt(form.google_reviews) : null,
        google_rating: form.google_rating ? parseFloat(form.google_rating) : null,
        website_status: form.website_status || null,
        status: form.status,
        visit_date: form.visit_date || null,
        visit_notes: form.visit_notes.trim() || null,
        pitch_argument: form.pitch_argument.trim() || null,
      }
      await onSubmit(payload)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.saveError)
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return }
    setDeleting(true)
    try {
      await onDelete!()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.deleteError)
      setDeleting(false)
    }
  }

  const websiteStatuses: WebsiteStatus[] = ['none', 'bad', 'correct', 'good']

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{error}</div>
      )}

      <Section title={t.infoSection}>
        <Field label={t.businessName}>
          <input className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} placeholder="La Crêperie Bretonne" />
        </Field>
        <Field label={t.ownerName}>
          <input className={inputCls} value={form.owner} onChange={e => set('owner', e.target.value)} placeholder="Jean Dupont" />
        </Field>
        <Field label={t.address}>
          <input className={inputCls} value={form.address} onChange={e => set('address', e.target.value)} placeholder="12 rue de la Paix" />
        </Field>
        <Field label={t.city}>
          <input className={inputCls} value={form.city} onChange={e => set('city', e.target.value)} placeholder="Paris" />
        </Field>
        <Field label={t.phone}>
          <input className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)} type="tel" placeholder="06 12 34 56 78" />
        </Field>
      </Section>

      <Section title={t.googleSection}>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t.googleRating}>
            <input className={inputCls} value={form.google_rating} onChange={e => set('google_rating', e.target.value)} type="number" step="0.1" min="0" max="5" placeholder="4.2" />
          </Field>
          <Field label={t.googleReviews}>
            <input className={inputCls} value={form.google_reviews} onChange={e => set('google_reviews', e.target.value)} type="number" min="0" placeholder="120" />
          </Field>
        </div>
      </Section>

      <Section title={t.websiteSection}>
        <div className="grid grid-cols-2 gap-2">
          {websiteStatuses.map(ws => (
            <button key={ws} type="button" onClick={() => set('website_status', ws)}
              className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-colors ${
                form.website_status === ws ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-600'
              }`}>
              {t.websiteStatus[ws]}
            </button>
          ))}
        </div>
      </Section>

      <Section title={t.statusSection}>
        <div className="flex flex-col gap-2">
          {ALL_STATUSES.map(s => (
            <button key={s} type="button" onClick={() => set('status', s)}
              className={`py-3 px-4 rounded-xl text-sm font-medium border-2 text-left transition-colors ${
                form.status === s ? 'border-gray-900 bg-gray-50' : 'border-gray-100 bg-white text-gray-600'
              }`}>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[s]}`}>
                {t.status[s]}
              </span>
            </button>
          ))}
        </div>
      </Section>

      <Section title={t.visitSection}>
        <Field label={t.visitDate}>
          <input className={inputCls} value={form.visit_date} onChange={e => set('visit_date', e.target.value)} type="date" />
        </Field>
        <div className="flex justify-end">
          <button type="button" onClick={() => set('visit_date', todayISO())} className="text-xs text-gray-500 underline">
            {t.today}
          </button>
        </div>
        <Field label={t.visitNotes}>
          <textarea className={`${inputCls} min-h-[100px] resize-none`} value={form.visit_notes} onChange={e => set('visit_notes', e.target.value)} placeholder={t.visitNotesPlaceholder} />
        </Field>
        <Field label={t.pitchArgument}>
          <textarea className={`${inputCls} min-h-[80px] resize-none`} value={form.pitch_argument} onChange={e => set('pitch_argument', e.target.value)} placeholder={t.pitchPlaceholder} />
        </Field>
      </Section>

      <button type="submit" disabled={saving}
        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-semibold text-base disabled:opacity-50 active:bg-gray-700 transition-colors">
        {saving ? t.saving : isNew ? t.addProspect : t.save}
      </button>

      {onDelete && (
        <button type="button" onClick={handleDelete} disabled={deleting}
          className={`w-full py-4 rounded-2xl font-semibold text-base transition-colors ${
            confirmDelete ? 'bg-red-600 text-white active:bg-red-700' : 'bg-red-50 text-red-600 active:bg-red-100'
          }`}>
          {deleting ? t.deleting : confirmDelete ? t.deleteConfirm : t.delete}
        </button>
      )}

      {confirmDelete && (
        <button type="button" onClick={() => setConfirmDelete(false)} className="text-center text-sm text-gray-400 underline">
          {t.cancel}
        </button>
      )}
    </form>
  )
}

const inputCls = 'w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent min-h-[44px]'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-wider mb-4">{title}</h3>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  )
}
