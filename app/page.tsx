export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Users, MessageSquare, Shield, Star } from 'lucide-react'
import { prisma } from '@/lib/prisma'

async function getFeaturedUsers() {
  return await prisma.user.findMany({
    where: {
      claimed: true,
    },
    take: 6,
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
        take: 3,
      },
    },
  })
}

async function getStats() {
  const [totalUsers, totalSkills, totalQuestions] = await Promise.all([
    prisma.user.count(),
    prisma.skill.count(),
    prisma.question.count({ where: { approved: true } }),
  ])

  return { totalUsers, totalSkills, totalQuestions }
}

export default async function Home() {
  const featuredUsers = await getFeaturedUsers()
  const stats = await getStats()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-background to-muted/20 py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Find Expert Engineers & Professionals
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              A curated database of skilled engineers with verified expertise in electronics, 
              mechanics, software, and technical architecture. Managed by DeltaProto.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/people">
                <Button size="lg" className="w-full sm:w-auto">
                  <Users className="mr-2 h-5 w-5" />
                  Browse People
                </Button>
              </Link>
              <Link href="/questions">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Q&A Forum
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">{stats.totalUsers}</div>
              <div className="text-sm md:text-base text-muted-foreground mt-2">Professionals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">{stats.totalSkills}</div>
              <div className="text-sm md:text-base text-muted-foreground mt-2">Skills Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">{stats.totalQuestions}</div>
              <div className="text-sm md:text-base text-muted-foreground mt-2">Q&A Discussions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Users Section */}
      {featuredUsers.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Professionals</h2>
                <p className="text-muted-foreground">
                  Explore our curated network of experienced engineers
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredUsers.map((user) => (
                  <Link key={user.id} href={`/people/${user.id}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.image || ''} alt={user.name || ''} />
                            <AvatarFallback>
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg truncate">{user.name}</CardTitle>
                            {user.yearsExperience && (
                              <CardDescription>
                                {user.yearsExperience}+ years experience
                              </CardDescription>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {user.bio && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {user.bio}
                          </p>
                        )}
                        <div className="space-y-2">
                          <div className="text-sm font-semibold">Top Skills:</div>
                          <div className="flex flex-wrap gap-2">
                            {user.skills.slice(0, 3).map((userSkill) => (
                              <Badge key={userSkill.id} variant="secondary" className="gap-1">
                                {userSkill.skill.name}
                                <div className="flex items-center ml-1">
                                  <Star className="h-3 w-3 fill-current" />
                                  <span className="text-xs ml-0.5">{userSkill.rating}</span>
                                </div>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link href="/people">
                  <Button size="lg" variant="outline">
                    View All Professionals
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How DeltaProNet Works</h2>
              <p className="text-muted-foreground">
                A curated network for skilled professionals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Curated by DeltaProto</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    All profiles are carefully curated and managed by DeltaProto to ensure 
                    quality and accuracy of skills and experience.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Skills Rating System</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Each skill is rated from 1 to 5 stars, providing clear insight into 
                    expertise levels across different technical domains.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Community Q&A</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Engage with the community through our Q&A forum where professionals 
                    share knowledge and answer technical questions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto text-center p-8 md:p-12">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">Join DeltaProNet</CardTitle>
              <CardDescription className="text-base md:text-lg">
                Are you a skilled engineer? Sign in with LinkedIn to claim your profile or 
                be added by a DeltaProto curator.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Link href="/api/auth/signin">
                <Button size="lg">
                  Sign in with LinkedIn
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

