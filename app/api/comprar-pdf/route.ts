import { NextResponse } from 'next/server'
import { comprarPdfAction } from '@/lib/dal/compras'

export async function POST(request: Request) {
  const formData = await request.formData()
  const result = await comprarPdfAction(formData)
  return NextResponse.json(result)
}
