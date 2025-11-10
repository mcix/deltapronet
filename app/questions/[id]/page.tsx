import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions, canModerateContent } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AnswerForm } from '@/components/answer-form'
import { Clock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

async function getQuestion(id: string) {
  return await prisma.question.findUnique({
    where: { id },
    include: {
      author: true,
      answers: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })
}

export default async function QuestionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const { id } = await params
  const question = await getQuestion(id)

  if (!question) {
    notFound()
  }

  // If question is not approved, only show to author and moderators
  if (!question.approved) {
    if (!session || (session.user.id !== question.authorId && !canModerateContent(session.user.role))) {
      redirect('/questions')
    }
  }

  const isModerator = session && canModerateContent(session.user.role)

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/questions">
          <Button variant="ghost" className="mb-6">
            ← Back to Questions
          </Button>
        </Link>

        {/* Question */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarImage src={question.author.image || ''} alt={question.author.name || ''} />
                <AvatarFallback>
                  {question.author.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{question.author.name}</span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(question.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {!question.approved && (
                  <Badge variant="outline">Pending Approval</Badge>
                )}
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl">{question.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap mb-6">
              {question.content}
            </p>
            
            {isModerator && !question.approved && (
              <div className="flex gap-2 pt-4 border-t">
                <form action={`/api/questions/${question.id}`} method="POST">
                  <input type="hidden" name="approved" value="true" />
                  <Button type="submit" size="sm" variant="default">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </form>
                <form action={`/api/questions/${question.id}`} method="DELETE">
                  <Button type="submit" size="sm" variant="destructive">
                    <XCircle className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Answers */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {question.answers.length} {question.answers.length === 1 ? 'Answer' : 'Answers'}
            </h2>
          </div>

          {question.answers.map((answer) => (
            <Card key={answer.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={answer.author.image || ''} alt={answer.author.name || ''} />
                    <AvatarFallback>
                      {answer.author.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{answer.author.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(answer.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {answer.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Answer Form */}
          {session && question.approved && (
            <Card>
              <CardHeader>
                <CardTitle>Your Answer</CardTitle>
                <CardDescription>
                  Share your knowledge with the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnswerForm questionId={question.id} />
              </CardContent>
            </Card>
          )}

          {!session && question.approved && (
            <Card>
              <CardContent className="pt-6 text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Sign in to answer this question
                </p>
                <Link href="/api/auth/signin">
                  <Button>Sign in with LinkedIn</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

