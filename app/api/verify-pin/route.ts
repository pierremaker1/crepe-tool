import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { pin } = await req.json()
  const appPin = process.env.APP_PIN
  if (!appPin) {
    return NextResponse.json({ error: 'PIN not configured' }, { status: 500 })
  }
  if (pin === appPin) {
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
}
