import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.claimed) {
      return NextResponse.json({ error: 'Profile already claimed' }, { status: 400 })
    }

    // Verify LinkedIn URL matches
    if (session.user.linkedInUrl !== user.linkedInUrl) {
      return NextResponse.json(
        { error: 'LinkedIn URL does not match' },
        { status: 403 }
      )
    }

    // Claim the profile
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email: session.user.email,
        image: session.user.image,
        claimed: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Claim profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

