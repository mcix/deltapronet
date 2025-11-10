'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'

export function AddUserForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [name, setName] = useState('')
  const [linkedInUrl, setLinkedInUrl] = useState('')
  const [education, setEducation] = useState('')
  const [yearsExperience, setYearsExperience] = useState('')
  const [bio, setBio] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          linkedInUrl,
          education,
          yearsExperience: yearsExperience ? parseInt(yearsExperience) : null,
          bio,
        }),
      })

      if (response.ok) {
        const user = await response.json()
        router.push(`/people/${user.id}`)
        router.refresh()
      } else {
        alert('Failed to create user. Please try again.')
      }
    } catch (error) {
      console.error('Failed to create user:', error)
      alert('Failed to create user. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="User's full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedInUrl">LinkedIn URL *</Label>
            <Input
              id="linkedInUrl"
              type="url"
              value={linkedInUrl}
              onChange={(e) => setLinkedInUrl(e.target.value)}
              placeholder="https://www.linkedin.com/in/..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Input
              id="education"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="e.g., TU Twente"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearsExperience">Years of Experience</Label>
            <Input
              id="yearsExperience"
              type="number"
              min="0"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
              placeholder="e.g., 15"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief description..."
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Plus className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

