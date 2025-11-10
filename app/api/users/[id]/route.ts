import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, canEditUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  if (!canEditUser(session.user.id, id, session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { name, education, yearsExperience, bio, linkedInUrl } = body

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        education,
        yearsExperience,
        bio,
        linkedInUrl,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

