import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { QuestionForm } from '@/components/question-form'

export default async function NewQuestionPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Ask a Question</h1>
          <p className="text-muted-foreground">
            Share your question with the DeltaProNet community
          </p>
        </div>

        <QuestionForm />
      </div>
    </div>
  )
}

