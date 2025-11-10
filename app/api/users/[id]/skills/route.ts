import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, canEditUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!canEditUser(session.user.id, params.id, session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { skills } = body as { skills: { skillId: string; rating: number }[] }

    // Delete all existing skills for this user
    await prisma.userSkill.deleteMany({
      where: { userId: params.id },
    })

    // Create new skills
    if (skills && skills.length > 0) {
      await prisma.userSkill.createMany({
        data: skills.map((skill) => ({
          userId: params.id,
          skillId: skill.skillId,
          rating: Math.max(1, Math.min(5, skill.rating)), // Ensure rating is 1-5
        })),
      })
    }

    const updatedSkills = await prisma.userSkill.findMany({
      where: { userId: params.id },
      include: {
        skill: {
          include: {
            expertiseArea: true,
          },
        },
      },
    })

    return NextResponse.json(updatedSkills)
  } catch (error) {
    console.error('Update skills error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

