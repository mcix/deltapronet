'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SkillRating } from '@/components/skill-rating'
import { Badge } from '@/components/ui/badge'
import { Save, Plus, X } from 'lucide-react'
import { Prisma } from '@prisma/client'

type UserWithSkills = Prisma.UserGetPayload<{
  include: {
    skills: {
      include: {
        skill: {
          include: {
            expertiseArea: true
          }
        }
      }
    }
  }
}>

type SkillWithArea = Prisma.SkillGetPayload<{
  include: {
    expertiseArea: true
  }
}>

interface ProfileEditFormProps {
  user: UserWithSkills
  allSkills: SkillWithArea[]
}

export function ProfileEditForm({ user, allSkills }: ProfileEditFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [name, setName] = useState(user.name || '')
  const [education, setEducation] = useState(user.education || '')
  const [yearsExperience, setYearsExperience] = useState(user.yearsExperience?.toString() || '')
  const [bio, setBio] = useState(user.bio || '')
  const [linkedInUrl, setLinkedInUrl] = useState(user.linkedInUrl || '')
  
  // Skills state
  const [userSkills, setUserSkills] = useState<Map<string, number>>(
    new Map(user.skills.map(us => [us.skillId, us.rating]))
  )

  // Group skills by expertise area
  const skillsByArea = allSkills.reduce((acc, skill) => {
    const areaName = skill.expertiseArea.name
    if (!acc[areaName]) {
      acc[areaName] = {
        area: skill.expertiseArea,
        skills: [],
      }
    }
    acc[areaName].skills.push(skill)
    return acc
  }, {} as Record<string, { area: any; skills: SkillWithArea[] }>)

  const sortedAreas = Object.values(skillsByArea).sort(
    (a, b) => a.area.order - b.area.order
  )

  const handleSkillRatingChange = (skillId: string, rating: number) => {
    const newSkills = new Map(userSkills)
    if (rating === 0) {
      newSkills.delete(skillId)
    } else {
      newSkills.set(skillId, rating)
    }
    setUserSkills(newSkills)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Update user profile
      const profileResponse = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          education,
          yearsExperience: yearsExperience ? parseInt(yearsExperience) : null,
          bio,
          linkedInUrl,
        }),
      })

      if (!profileResponse.ok) {
        throw new Error('Failed to update profile')
      }

      // Update skills
      const skillsResponse = await fetch(`/api/users/${user.id}/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: Array.from(userSkills.entries()).map(([skillId, rating]) => ({
            skillId,
            rating,
          })),
        }),
      })

      if (!skillsResponse.ok) {
        throw new Error('Failed to update skills')
      }

      router.push(`/people/${user.id}`)
      router.refresh()
    } catch (error) {
      console.error('Failed to save profile:', error)
      alert('Failed to save profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Update your personal and professional details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
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
            <Label htmlFor="linkedInUrl">LinkedIn URL</Label>
            <Input
              id="linkedInUrl"
              type="url"
              value={linkedInUrl}
              onChange={(e) => setLinkedInUrl(e.target.value)}
              placeholder="https://www.linkedin.com/in/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills & Expertise</CardTitle>
          <CardDescription>
            Rate your proficiency in each skill (1-5 stars). Leave unrated to remove.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sortedAreas.map(({ area, skills }) => (
              <div key={area.id}>
                <h3 className="font-semibold mb-3 pb-2 border-b">{area.name}</h3>
                <div className="space-y-3">
                  {skills.map((skill) => {
                    const currentRating = userSkills.get(skill.id) || 0
                    return (
                      <div
                        key={skill.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="font-medium truncate">{skill.name}</span>
                          {skill.type !== 'GENERAL' && (
                            <Badge variant="outline" className="text-xs shrink-0">
                              {skill.type.toLowerCase()}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <SkillRating
                            rating={currentRating}
                            interactive
                            onChange={(rating) => handleSkillRatingChange(skill.id, rating)}
                          />
                          {currentRating > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSkillRatingChange(skill.id, 0)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

