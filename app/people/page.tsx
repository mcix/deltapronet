export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { UserCard } from '@/components/user-card'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter } from 'lucide-react'
import Link from 'next/link'

async function getUsers(searchParams: { search?: string; area?: string; skill?: string }) {
  const where: any = {}

  if (searchParams.search) {
    where.name = {
      contains: searchParams.search,
      mode: 'insensitive',
    }
  }

  if (searchParams.area || searchParams.skill) {
    where.skills = {
      some: {},
    }

    if (searchParams.area) {
      where.skills.some.skill = {
        expertiseArea: {
          name: searchParams.area,
        },
      }
    }

    if (searchParams.skill) {
      where.skills.some.skill = {
        name: searchParams.skill,
      }
    }
  }

  return await prisma.user.findMany({
    where,
    include: {
      skills: {
        include: {
          skill: {
            include: {
              expertiseArea: true,
            },
          },
        },
        orderBy: {
          rating: 'desc',
        },
        take: 5,
      },
    },
    orderBy: {
      name: 'asc',
    },
  })
}

async function getExpertiseAreas() {
  return await prisma.expertiseArea.findMany({
    orderBy: {
      order: 'asc',
    },
  })
}

async function getTopSkills() {
  const userSkills = await prisma.userSkill.findMany({
    include: {
      skill: true,
    },
    take: 20,
    orderBy: {
      rating: 'desc',
    },
  })

  // Get unique skills
  const uniqueSkills = Array.from(
    new Map(userSkills.map((us) => [us.skill.id, us.skill])).values()
  ).slice(0, 10)

  return uniqueSkills
}

interface PageProps {
  searchParams: { search?: string; area?: string; skill?: string }
}

export default async function PeoplePage({ searchParams }: PageProps) {
  const users = await getUsers(searchParams)
  const expertiseAreas = await getExpertiseAreas()
  const topSkills = await getTopSkills()

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Professionals</h1>
          <p className="text-muted-foreground">
            Explore our curated network of skilled engineers and professionals
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form method="get" className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="search"
                  placeholder="Search by name..."
                  defaultValue={searchParams.search}
                  className="pl-10"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">Filter by Expertise Area:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href="/people">
                    <Badge
                      variant={!searchParams.area ? 'default' : 'outline'}
                      className="cursor-pointer"
                    >
                      All
                    </Badge>
                  </Link>
                  {expertiseAreas.map((area) => (
                    <Link
                      key={area.id}
                      href={`/people?area=${encodeURIComponent(area.name)}`}
                    >
                      <Badge
                        variant={searchParams.area === area.name ? 'default' : 'outline'}
                        className="cursor-pointer"
                      >
                        {area.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">Popular Skills:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {topSkills.map((skill) => (
                    <Link
                      key={skill.id}
                      href={`/people?skill=${encodeURIComponent(skill.name)}`}
                    >
                      <Badge
                        variant={searchParams.skill === skill.name ? 'default' : 'secondary'}
                        className="cursor-pointer"
                      >
                        {skill.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>

              {(searchParams.search || searchParams.area || searchParams.skill) && (
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">
                    {users.length} result{users.length !== 1 ? 's' : ''} found
                  </span>
                  <Link href="/people">
                    <Badge variant="outline" className="cursor-pointer">
                      Clear filters
                    </Badge>
                  </Link>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">
                No professionals found matching your criteria.
              </p>
              <Link href="/people" className="text-primary hover:underline text-sm mt-2 inline-block">
                Clear filters
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

