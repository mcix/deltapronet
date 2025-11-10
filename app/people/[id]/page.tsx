import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SkillsList } from '@/components/skills-list'
import { CommentsList } from '@/components/comments-list'
import { Briefcase, GraduationCap, Edit, Linkedin, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { UserRole } from '@prisma/client'

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
      commentsReceived: {
        where: { approved: true },
        include: {
          author: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })
}

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const user = await getUser(params.id)

  if (!user) {
    notFound()
  }

  const isOwner = session?.user?.id === user.id
  const canEdit = isOwner || session?.user?.role === UserRole.CURATOR || session?.user?.role === UserRole.MODERATOR
  const canClaim = !user.claimed && session && !isOwner

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 shrink-0">
                <AvatarImage src={user.image || ''} alt={user.name || ''} />
                <AvatarFallback className="text-3xl md:text-4xl">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{user.name}</h1>
                    {!user.claimed && (
                      <Badge variant="outline" className="mb-2">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Unclaimed Profile
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 shrink-0">
                    {user.linkedInUrl && (
                      <Link href={user.linkedInUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </Button>
                      </Link>
                    )}
                    {canEdit && (
                      <Link href={`/people/${user.id}/edit`}>
                        <Button size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </Link>
                    )}
                    {canClaim && (
                      <Link href={`/people/${user.id}/claim`}>
                        <Button size="sm" variant="default">
                          Claim This Profile
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {user.yearsExperience && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="h-4 w-4 shrink-0" />
                      <span>{user.yearsExperience}+ years of experience</span>
                    </div>
                  )}
                  {user.education && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="h-4 w-4 shrink-0" />
                      <span>{user.education}</span>
                    </div>
                  )}
                </div>

                {user.bio && (
                  <p className="text-muted-foreground">{user.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="skills">Skills & Expertise</TabsTrigger>
            <TabsTrigger value="comments">
              Comments ({user.commentsReceived.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="skills">
            <SkillsList user={user} />
          </TabsContent>

          <TabsContent value="comments">
            <CommentsList
              comments={user.commentsReceived}
              targetUserId={user.id}
              canModerate={session?.user?.role === UserRole.MODERATOR || session?.user?.role === UserRole.CURATOR}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

