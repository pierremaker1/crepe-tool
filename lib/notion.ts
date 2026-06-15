import { Prospect, ProspectInsert, ProspectUpdate, ProspectStatus, WebsiteStatus } from './types'

const NOTION_API = 'https://api.notion.com/v1'
const NOTION_VERSION = '2022-06-28'

// --- Enum <-> Notion select option mapping ---

const STATUS_TO_NOTION: Record<ProspectStatus, string> = {
  to_visit: 'À visiter',
  not_interested: 'Visité - Non intéressé',
  to_follow_up: 'Visité - À relancer',
  meeting_booked: 'RDV décroché',
  client: 'Client',
}

const NOTION_TO_STATUS: Record<string, ProspectStatus> = Object.fromEntries(
  Object.entries(STATUS_TO_NOTION).map(([key, value]) => [value, key as ProspectStatus])
)

const WEBSITE_TO_NOTION: Record<WebsiteStatus, string> = {
  none: 'Aucun',
  bad: 'Nul/Ancien',
  correct: 'Correct',
  good: 'Bon',
}

const NOTION_TO_WEBSITE: Record<string, WebsiteStatus> = Object.fromEntries(
  Object.entries(WEBSITE_TO_NOTION).map(([key, value]) => [value, key as WebsiteStatus])
)

// --- Notion API types (subset) ---

interface NotionRichText {
  plain_text: string
}

interface NotionSelectOption {
  name: string
}

interface NotionDateValue {
  start: string
  end?: string | null
}

interface NotionProperty {
  title?: NotionRichText[]
  rich_text?: NotionRichText[]
  select?: NotionSelectOption | null
  number?: number | null
  phone_number?: string | null
  date?: NotionDateValue | null
}

interface NotionPage {
  id: string
  archived: boolean
  created_time: string
  last_edited_time: string
  properties: Record<string, NotionProperty>
}

interface NotionQueryResponse {
  results: NotionPage[]
  has_more: boolean
  next_cursor: string | null
}

// --- Low-level request helper ---

function notionHeaders(): HeadersInit {
  const token = process.env.NOTION_TOKEN
  if (!token) throw new Error('NOTION_TOKEN manquant')
  return {
    Authorization: `Bearer ${token}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  }
}

function getDatabaseId(): string {
  const id = process.env.NOTION_DATABASE_ID
  if (!id) throw new Error('NOTION_DATABASE_ID manquant')
  return id
}

async function notionRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${NOTION_API}${path}`, { ...init, headers: notionHeaders() })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Notion API ${res.status}: ${body}`)
  }
  return res.json() as Promise<T>
}

// --- Mapping: Notion page -> Prospect ---

function getTitle(prop?: NotionProperty): string {
  return (prop?.title ?? []).map((t) => t.plain_text).join('')
}

function getRichText(prop?: NotionProperty): string | null {
  const text = (prop?.rich_text ?? []).map((t) => t.plain_text).join('')
  return text || null
}

function getSelect(prop?: NotionProperty): string | null {
  return prop?.select?.name ?? null
}

function getNumber(prop?: NotionProperty): number | null {
  return prop?.number ?? null
}

function getPhone(prop?: NotionProperty): string | null {
  return prop?.phone_number || null
}

function getDate(prop?: NotionProperty): string | null {
  return prop?.date?.start ?? null
}

export function fromNotionPage(page: NotionPage): Prospect {
  const props = page.properties ?? {}
  const notionStatus = getSelect(props['Statut'])
  const notionWebsite = getSelect(props['Site web'])

  return {
    id: page.id,
    name: getTitle(props['Nom']),
    owner: getRichText(props['Patron(s)']),
    address: getRichText(props['Adresse']),
    city: getRichText(props['Ville']),
    phone: getPhone(props['Téléphone']),
    google_reviews: getNumber(props['Avis Google']),
    google_rating: getNumber(props['Note Google']),
    website_status: notionWebsite ? NOTION_TO_WEBSITE[notionWebsite] ?? null : null,
    status: notionStatus ? NOTION_TO_STATUS[notionStatus] ?? 'to_visit' : 'to_visit',
    visit_date: getDate(props['Date visite']),
    visit_notes: getRichText(props['Résultat visite']),
    pitch_argument: getRichText(props['Argument principal']),
    created_at: page.created_time,
    updated_at: page.last_edited_time,
  }
}

// --- Mapping: Prospect data -> Notion properties ---

export function toNotionProperties(data: Partial<ProspectInsert>): Record<string, unknown> {
  const props: Record<string, unknown> = {}

  if (data.name !== undefined) {
    props['Nom'] = { title: [{ text: { content: data.name } }] }
  }
  if (data.owner !== undefined) {
    props['Patron(s)'] = { rich_text: data.owner ? [{ text: { content: data.owner } }] : [] }
  }
  if (data.address !== undefined) {
    props['Adresse'] = { rich_text: data.address ? [{ text: { content: data.address } }] : [] }
  }
  if (data.city !== undefined) {
    props['Ville'] = { rich_text: data.city ? [{ text: { content: data.city } }] : [] }
  }
  if (data.phone !== undefined) {
    props['Téléphone'] = { phone_number: data.phone || null }
  }
  if (data.google_reviews !== undefined) {
    props['Avis Google'] = { number: data.google_reviews }
  }
  if (data.google_rating !== undefined) {
    props['Note Google'] = { number: data.google_rating }
  }
  if (data.website_status !== undefined) {
    const notionVal = data.website_status ? WEBSITE_TO_NOTION[data.website_status] : null
    props['Site web'] = { select: notionVal ? { name: notionVal } : null }
  }
  if (data.status !== undefined) {
    props['Statut'] = { select: { name: STATUS_TO_NOTION[data.status] } }
  }
  if (data.visit_date !== undefined) {
    props['Date visite'] = { date: data.visit_date ? { start: data.visit_date } : null }
  }
  if (data.visit_notes !== undefined) {
    props['Résultat visite'] = { rich_text: data.visit_notes ? [{ text: { content: data.visit_notes } }] : [] }
  }
  if (data.pitch_argument !== undefined) {
    props['Argument principal'] = {
      rich_text: data.pitch_argument ? [{ text: { content: data.pitch_argument } }] : [],
    }
  }

  return props
}

// --- CRUD ---

export async function listProspects(): Promise<Prospect[]> {
  const databaseId = getDatabaseId()
  const pages: NotionPage[] = []
  let cursor: string | undefined

  do {
    const body: Record<string, unknown> = { page_size: 100 }
    if (cursor) body.start_cursor = cursor
    const data = await notionRequest<NotionQueryResponse>(`/databases/${databaseId}/query`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    pages.push(...data.results)
    cursor = data.has_more ? data.next_cursor ?? undefined : undefined
  } while (cursor)

  return pages
    .filter((p) => !p.archived)
    .map(fromNotionPage)
    .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1))
}

export async function getProspect(id: string): Promise<Prospect | null> {
  const res = await fetch(`${NOTION_API}/pages/${id}`, { headers: notionHeaders() })
  if (res.status === 404) return null
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Notion API ${res.status}: ${body}`)
  }
  const page = (await res.json()) as NotionPage
  if (page.archived) return null
  return fromNotionPage(page)
}

export async function createProspect(data: ProspectInsert): Promise<Prospect> {
  const databaseId = getDatabaseId()
  const page = await notionRequest<NotionPage>('/pages', {
    method: 'POST',
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: toNotionProperties(data),
    }),
  })
  return fromNotionPage(page)
}

export async function updateProspect(id: string, data: ProspectUpdate): Promise<Prospect> {
  const page = await notionRequest<NotionPage>(`/pages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ properties: toNotionProperties(data) }),
  })
  return fromNotionPage(page)
}

export async function deleteProspect(id: string): Promise<void> {
  await notionRequest<NotionPage>(`/pages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ archived: true }),
  })
}
