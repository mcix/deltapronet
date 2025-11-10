import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { content, targetUserId } = body

    if (!content || !targetUserId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: session.user.id,
        targetUserId,
        approved: false, // Comments need moderation
      },
      include: {
        author: true,
      },
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

