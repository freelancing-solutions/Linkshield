import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// export async function GET() {
//   try {
//     // quick lightweight DB check
//     await db.$queryRaw`SELECT 1`
//     return NextResponse.json({ status: 'operational' }, { status: 200 })
//   } catch (err) {
//     // If db is unreachable, mark degraded/down
//     return NextResponse.json({ status: 'degraded' }, { status: 503 })
//   }
// }


export async function GET() {
  return NextResponse.json({ message: "Good!" });
}