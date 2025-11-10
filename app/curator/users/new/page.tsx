import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions, canModerateContent } from '@/lib/auth'
import { AddUserForm } from '@/components/add-user-form'

export default async function AddUserPage() {
  const session = await getServerSession(authOptions)

  if (!session || !canModerateContent(session.user.role)) {
    redirect('/')
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Add New User</h1>
          <p className="text-muted-foreground">
            Create a new user profile in the database
          </p>
        </div>

        <AddUserForm />
      </div>
    </div>
  )
}

