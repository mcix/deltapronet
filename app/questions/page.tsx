export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageSquare, Plus, Clock } from 'lucide-react'

async function getQuestions() {
  const session = await getServerSession(authOptions)
  
  // Show all questions to moderators/curators, only approved to others
  const where = session?.user?.role === 'MODERATOR' || session?.user?.role === 'CURATOR'
    ? {}
    : { approved: true }

  return await prisma.question.findMany({
    where,
    include: {
      author: true,
      _count: {
        select: { answers: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export default async function QuestionsPage() {
  const session = await getServerSession(authOptions)
  const questions = await getQuestions()

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Q&A Forum</h1>
            <p className="text-muted-foreground">
              Ask questions and share knowledge with the community
            </p>
          </div>
          {session && (
            <Link href="/questions/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ask Question
              </Button>
            </Link>
          )}
        </div>

        {/* Questions List */}
        {questions.length > 0 ? (
          <div className="space-y-4">
            {questions.map((question) => (
              <Link key={question.id} href={`/questions/${question.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={question.author.image || ''} alt={question.author.name || ''} />
                        <AvatarFallback>
                          {question.author.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{question.title}</CardTitle>
                          {!question.approved && (
                            <Badge variant="outline">Pending Approval</Badge>
                          )}
                        </div>
                        <CardDescription className="flex items-center gap-2 flex-wrap">
                          <span>{question.author.name}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(question.createdAt).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2 mb-4">
                      {question.content}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>{question._count.answers} {question._count.answers === 1 ? 'answer' : 'answers'}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                No questions yet. Be the first to ask!
              </p>
              {session && (
                <Link href="/questions/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ask Question
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

