import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Edit, MessageSquare, Star, Users } from 'lucide-react'

async function getUserData(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      skills: {
        include: {
          skill: {
            include: {
              expertiseArea: true,
            },
          },
        },
        orderBy: {
          rating: 'desc',
        },
        take: 5,
      },
      commentsReceived: {
        where: { approved: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  })
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin')
  }

  const user = await getUserData(session.user.id)

  if (!user) {
    redirect('/')
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your profile and view your activity
          </p>
        </div>

        {/* Profile Summary */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-20 w-20 md:h-24 md:w-24 shrink-0">
                <AvatarImage src={user.image || ''} alt={user.name || ''} />
                <AvatarFallback className="text-2xl">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    {user.claimed && (
                      <Badge variant="secondary" className="mt-2">Claimed Profile</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/people/${user.id}`}>
                      <Button variant="outline" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        View Public Profile
                      </Button>
                    </Link>
                    <Link href={`/people/${user.id}/edit`}>
                      <Button size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                </div>
                {user.bio && (
                  <p className="text-muted-foreground">{user.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Top Skills
              </CardTitle>
              <CardDescription>
                Your highest-rated expertise areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.skills.length > 0 ? (
                <div className="space-y-3">
                  {user.skills.map((userSkill) => (
                    <div key={userSkill.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{userSkill.skill.name}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < userSkill.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No skills added yet</p>
              )}
              <Link href={`/people/${user.id}/edit`}>
                <Button variant="outline" className="w-full mt-4">
                  Manage Skills
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Comments
              </CardTitle>
              <CardDescription>
                Comments received on your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.commentsReceived.length > 0 ? (
                <div className="space-y-4">
                  {user.commentsReceived.slice(0, 3).map((comment) => (
                    <div key={comment.id} className="text-sm">
                      <p className="text-muted-foreground line-clamp-2">{comment.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No comments yet</p>
              )}
              <Link href={`/people/${user.id}`}>
                <Button variant="outline" className="w-full mt-4">
                  View All Comments
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

