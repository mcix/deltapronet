import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SkillRating } from '@/components/skill-rating'
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

interface SkillsListProps {
  user: UserWithSkills
  className?: string
}

export function SkillsList({ user, className }: SkillsListProps) {
  // Group skills by expertise area
  const skillsByArea = user.skills.reduce((acc, userSkill) => {
    const areaName = userSkill.skill.expertiseArea.name
    if (!acc[areaName]) {
      acc[areaName] = {
        area: userSkill.skill.expertiseArea,
        skills: [],
      }
    }
    acc[areaName].skills.push(userSkill)
    return acc
  }, {} as Record<string, { area: any; skills: any[] }>)

  // Sort by area order
  const sortedAreas = Object.values(skillsByArea).sort(
    (a, b) => a.area.order - b.area.order
  )

  if (sortedAreas.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">No skills added yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      <div className="space-y-6">
        {sortedAreas.map(({ area, skills }) => (
          <Card key={area.id}>
            <CardHeader>
              <CardTitle className="text-lg">{area.name}</CardTitle>
              {area.description && (
                <CardDescription>{area.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {skills
                  .sort((a, b) => a.skill.order - b.skill.order)
                  .map((userSkill) => (
                    <div
                      key={userSkill.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b last:border-0"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="font-medium truncate">{userSkill.skill.name}</span>
                        {userSkill.skill.type !== 'GENERAL' && (
                          <Badge variant="outline" className="text-xs shrink-0">
                            {userSkill.skill.type.toLowerCase()}
                          </Badge>
                        )}
                        {userSkill.verified && (
                          <Badge variant="secondary" className="text-xs shrink-0">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <SkillRating rating={userSkill.rating} size="sm" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

