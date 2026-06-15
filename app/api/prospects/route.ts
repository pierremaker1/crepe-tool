import { NextRequest, NextResponse } from 'next/server'
import { listProspects, createProspect } from '@/lib/notion'
import { ProspectInsert } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await listProspects()
    return NextResponse.json({ data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ProspectInsert
    const data = await createProspect(body)
    return NextResponse.json({ data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
