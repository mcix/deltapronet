import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, canModerateContent } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !canModerateContent(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, linkedInUrl, education, yearsExperience, bio } = body

    if (!name || !linkedInUrl) {
      return NextResponse.json({ error: 'Name and LinkedIn URL are required' }, { status: 400 })
    }

    const user = await prisma.user.create({
      data: {
        name,
        linkedInUrl,
        education,
        yearsExperience,
        bio,
        claimed: false,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

