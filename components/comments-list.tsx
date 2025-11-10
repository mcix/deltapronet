'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Send } from 'lucide-react'
import { Prisma } from '@prisma/client'
import { useRouter } from 'next/navigation'

type CommentWithAuthor = Prisma.CommentGetPayload<{
  include: { author: true }
}>

interface CommentsListProps {
  comments: CommentWithAuthor[]
  targetUserId: string
  canModerate?: boolean
}

export function CommentsList({ comments, targetUserId, canModerate }: CommentsListProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !session) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          targetUserId,
        }),
      })

      if (response.ok) {
        setNewComment('')
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to submit comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Comment Form */}
      {session && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add a Comment</CardTitle>
            <CardDescription>
              Share your experience working with this professional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                rows={4}
                className="resize-none"
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Comments are reviewed by moderators before being published
                </p>
                <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-6">
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
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                      {comment.approved && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              No comments yet. Be the first to share your experience!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

