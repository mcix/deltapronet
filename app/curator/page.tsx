import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions, canModerateContent } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { Plus, MessageSquare, Users, HelpCircle } from 'lucide-react'
import type { Prisma } from '@prisma/client'

type CommentWithRelations = Prisma.CommentGetPayload<{
  include: { author: true; target: true }
}>

type QuestionWithRelations = Prisma.QuestionGetPayload<{
  include: { author: true; _count: { select: { answers: true } } }
}>

async function getPendingContent(): Promise<{
  comments: CommentWithRelations[]
  questions: QuestionWithRelations[]
}> {
  const [comments, questions] = await Promise.all([
    prisma.comment.findMany({
      where: { approved: false },
      include: {
        author: true,
        target: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.question.findMany({
      where: { approved: false },
      include: {
        author: true,
        _count: {
          select: { answers: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return { comments, questions }
}

async function getStats() {
  const [totalUsers, claimedProfiles, pendingComments, pendingQuestions] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { claimed: true } }),
    prisma.comment.count({ where: { approved: false } }),
    prisma.question.count({ where: { approved: false } }),
  ])

  return { totalUsers, claimedProfiles, pendingComments, pendingQuestions }
}

export default async function CuratorDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || !canModerateContent(session.user.role)) {
    redirect('/')
  }

  const { comments, questions } = await getPendingContent()
  const stats = await getStats()

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Curator Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, moderate content, and oversee the DeltaProNet community
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-3xl">{stats.totalUsers}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Claimed Profiles</CardDescription>
              <CardTitle className="text-3xl">{stats.claimedProfiles}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending Comments</CardDescription>
              <CardTitle className="text-3xl">{stats.pendingComments}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending Questions</CardDescription>
              <CardTitle className="text-3xl">{stats.pendingQuestions}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="comments">
              Comments
              {stats.pendingComments > 0 && (
                <Badge variant="destructive" className="ml-2">{stats.pendingComments}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="questions">
              Questions
              {stats.pendingQuestions > 0 && (
                <Badge variant="destructive" className="ml-2">{stats.pendingQuestions}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Add new users to the database or edit existing profiles
                    </CardDescription>
                  </div>
                  <Link href="/curator/users/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link href="/people">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Browse All Users
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments">
            <Card>
              <CardHeader>
                <CardTitle>Pending Comments</CardTitle>
                <CardDescription>
                  Review and approve comments before they appear on user profiles
                </CardDescription>
              </CardHeader>
              <CardContent>
                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <Card key={comment.id}>
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="flex gap-4">
                              <Avatar className="h-10 w-10 shrink-0">
                                <AvatarImage src={comment.author.image || ''} alt={comment.author.name || ''} />
                                <AvatarFallback>
                                  {comment.author.name?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-semibold">{comment.author.name}</span>
                                  <span className="text-sm text-muted-foreground">→</span>
                                  <Link href={`/people/${comment.targetUserId}`} className="text-sm text-primary hover:underline">
                                    {comment.target.name}
                                  </Link>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <form action={`/api/comments/${comment.id}`} method="PATCH">
                                <input type="hidden" name="approved" value="true" />
                                <Button type="submit" size="sm" variant="default">
                                  Approve
                                </Button>
                              </form>
                              <form action={`/api/comments/${comment.id}`} method="DELETE">
                                <Button type="submit" size="sm" variant="destructive">
                                  Delete
                                </Button>
                              </form>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No pending comments</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions">
            <Card>
              <CardHeader>
                <CardTitle>Pending Questions</CardTitle>
                <CardDescription>
                  Review and approve questions before they appear in the Q&A forum
                </CardDescription>
              </CardHeader>
              <CardContent>
                {questions.length > 0 ? (
                  <div className="space-y-4">
                    {questions.map((question) => (
                      <Card key={question.id}>
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="flex gap-4">
                              <Avatar className="h-10 w-10 shrink-0">
                                <AvatarImage src={question.author.image || ''} alt={question.author.name || ''} />
                                <AvatarFallback>
                                  {question.author.name?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-semibold">{question.author.name}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(question.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{question.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                  {question.content}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Link href={`/questions/${question.id}`}>
                                <Button size="sm" variant="outline">
                                  View Full Question
                                </Button>
                              </Link>
                              <form action={`/api/questions/${question.id}`} method="PATCH">
                                <input type="hidden" name="approved" value="true" />
                                <Button type="submit" size="sm" variant="default">
                                  Approve
                                </Button>
                              </form>
                              <form action={`/api/questions/${question.id}`} method="DELETE">
                                <Button type="submit" size="sm" variant="destructive">
                                  Delete
                                </Button>
                              </form>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No pending questions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

