import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { pin } = await req.json()
  const appPin = process.env.APP_PIN?.trim()
  if (!appPin) {
    return NextResponse.json({ error: 'not_configured' }, { status: 500 })
  }
  if (String(pin).trim() === appPin) {
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'invalid' }, { status: 401 })
}
