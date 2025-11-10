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
    const { content, questionId } = body

    if (!content || !questionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify question exists and is approved
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    })

    if (!question || !question.approved) {
      return NextResponse.json({ error: 'Question not found or not approved' }, { status: 404 })
    }

    const answer = await prisma.answer.create({
      data: {
        content,
        questionId,
        authorId: session.user.id,
      },
      include: {
        author: true,
      },
    })

    return NextResponse.json(answer)
  } catch (error) {
    console.error('Create answer error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

