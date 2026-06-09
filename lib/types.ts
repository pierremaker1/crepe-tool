export type WebsiteStatus = 'none' | 'bad' | 'correct' | 'good'
export type ProspectStatus = 'to_visit' | 'not_interested' | 'to_follow_up' | 'meeting_booked' | 'client'

export interface Prospect {
  id: string
  name: string
  owner: string | null
  address: string | null
  city: string | null
  phone: string | null
  google_reviews: number | null
  google_rating: number | null
  website_status: WebsiteStatus | null
  status: ProspectStatus
  visit_date: string | null
  visit_notes: string | null
  pitch_argument: string | null
  created_at: string
  updated_at: string
}

export type ProspectInsert = Omit<Prospect, 'id' | 'created_at' | 'updated_at'>
export type ProspectUpdate = Partial<ProspectInsert>

export const STATUS_LABELS: Record<ProspectStatus, string> = {
  to_visit: 'À visiter',
  not_interested: 'Non intéressé',
  to_follow_up: 'À relancer',
  meeting_booked: 'RDV décroché',
  client: 'Client',
}

export const STATUS_COLORS: Record<ProspectStatus, string> = {
  to_visit: 'bg-blue-100 text-blue-800',
  not_interested: 'bg-red-100 text-red-800',
  to_follow_up: 'bg-orange-100 text-orange-800',
  meeting_booked: 'bg-green-100 text-green-800',
  client: 'bg-purple-100 text-purple-800',
}

export const STATUS_DOT_COLORS: Record<ProspectStatus, string> = {
  to_visit: 'bg-blue-500',
  not_interested: 'bg-red-500',
  to_follow_up: 'bg-orange-500',
  meeting_booked: 'bg-green-500',
  client: 'bg-purple-500',
}

export const WEBSITE_STATUS_LABELS: Record<WebsiteStatus, string> = {
  none: 'Aucun site',
  bad: 'Site nul',
  correct: 'Site correct',
  good: 'Bon site',
}

export const ALL_STATUSES: ProspectStatus[] = [
  'to_visit',
  'not_interested',
  'to_follow_up',
  'meeting_booked',
  'client',
]
