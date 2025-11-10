import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions, canEditUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProfileEditForm } from '@/components/profile-edit-form'

async function getUser(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      skills: {
        include: {
          skill: {
            include: {
              expertiseArea: true,
            },
          },
        },
      },
    },
  })
}

async function getAllSkills() {
  return await prisma.skill.findMany({
    include: {
      expertiseArea: true,
    },
    orderBy: [
      { expertiseArea: { order: 'asc' } },
      { order: 'asc' },
    ],
  })
}

export default async function EditProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const { id } = await params
  const user = await getUser(id)

  if (!session) {
    redirect('/api/auth/signin')
  }

  if (!user) {
    redirect('/people')
  }

  if (!canEditUser(session.user.id, user.id, session.user.role)) {
    redirect(`/people/${user.id}`)
  }

  const allSkills = await getAllSkills()

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Edit Profile</h1>
          <p className="text-muted-foreground">
            Update profile information and skill ratings
          </p>
        </div>

        <ProfileEditForm user={user} allSkills={allSkills} />
      </div>
    </div>
  )
}

