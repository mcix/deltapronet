import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

async function getUser(id: string) {
  return await prisma.user.findUnique({
    where: { id },
  })
}

export default async function ClaimProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const { id } = await params
  const user = await getUser(id)

  if (!session) {
    redirect('/api/auth/signin')
  }

  if (!user) {
    redirect('/people')
  }

  if (user.claimed) {
    redirect(`/people/${user.id}`)
  }

  // Check if LinkedIn URLs match
  const canClaim = session.user.linkedInUrl === user.linkedInUrl

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Claim Your Profile</CardTitle>
            <CardDescription>
              Verify that this profile belongs to you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Profile Information:</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Name:</span>{' '}
                  <span className="font-medium">{user.name}</span>
                </p>
                {user.linkedInUrl && (
                  <p>
                    <span className="text-muted-foreground">LinkedIn:</span>{' '}
                    <a
                      href={user.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {user.linkedInUrl}
                    </a>
                  </p>
                )}
              </div>
            </div>

            {canClaim ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✓ Your LinkedIn profile matches this account. You can claim this profile.
                  </p>
                </div>

                <form action={`/api/users/${user.id}/claim`} method="POST">
                  <Button type="submit" className="w-full" size="lg">
                    Claim This Profile
                  </Button>
                </form>
              </div>
            ) : (
              <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                      LinkedIn Profile Mismatch
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Your LinkedIn profile does not match the LinkedIn URL associated with this
                      profile. Please contact a DeltaProto curator if you believe this is your
                      profile.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <Button variant="outline" asChild className="w-full">
                <a href={`/people/${user.id}`}>Back to Profile</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

