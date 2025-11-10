import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { SkillRating } from '@/components/skill-rating'
import { Star, Briefcase, GraduationCap } from 'lucide-react'
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

interface UserCardProps {
  user: UserWithSkills
}

export function UserCard({ user }: UserCardProps) {
  const topSkills = user.skills
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)

  return (
    <Link href={`/people/${user.id}`}>
      <Card className="h-full hover:shadow-none transition-all hover:-translate-y-1 cursor-pointer">
        <CardHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 shrink-0">
              <AvatarImage src={user.image || ''} alt={user.name || ''} />
              <AvatarFallback className="text-lg">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg mb-1 truncate">{user.name}</CardTitle>
              <div className="space-y-1">
                {user.yearsExperience && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{user.yearsExperience}+ years</span>
                  </div>
                )}
                {user.education && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{user.education}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {user.bio && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {user.bio}
            </p>
          )}
          
          {topSkills.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-semibold">Top Skills:</div>
              <div className="space-y-2">
                {topSkills.map((userSkill) => (
                  <div
                    key={userSkill.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="text-sm truncate">{userSkill.skill.name}</span>
                    <SkillRating rating={userSkill.rating} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {topSkills.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              No skills added yet
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

