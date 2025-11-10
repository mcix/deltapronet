import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import LinkedInProvider from 'next-auth/providers/linkedin'
import { prisma } from './prisma'
import { UserRole } from '@prisma/client'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid profile email',
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          linkedInUrl: profile.sub ? `https://www.linkedin.com/in/${profile.sub}` : null,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            claimed: true,
            linkedInUrl: true,
          },
        })

        if (dbUser) {
          session.user.id = dbUser.id
          session.user.role = dbUser.role
          session.user.claimed = dbUser.claimed
          session.user.linkedInUrl = dbUser.linkedInUrl
        }
      }
      return session
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.sub = user.id
        
        // Try to find existing unclaimed profile by LinkedIn URL
        if (account?.provider === 'linkedin' && profile) {
          const linkedInUrl = `https://www.linkedin.com/in/${account.providerAccountId}`
          const existingProfile = await prisma.user.findFirst({
            where: {
              linkedInUrl: linkedInUrl,
              claimed: false,
            },
          })

          if (existingProfile) {
            // Auto-claim the profile
            await prisma.user.update({
              where: { id: existingProfile.id },
              data: {
                email: user.email,
                image: user.image,
                claimed: true,
              },
            })
            
            // Link the account to the existing profile
            await prisma.account.updateMany({
              where: { userId: user.id },
              data: { userId: existingProfile.id },
            })
            
            token.sub = existingProfile.id
          }
        }
      }
      return token
    },
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
}

// Helper functions for authorization
export async function getCurrentUser(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      claimed: true,
      linkedInUrl: true,
      education: true,
      yearsExperience: true,
      bio: true,
    },
  })
}

export function isCurator(role: UserRole) {
  return role === UserRole.CURATOR || role === UserRole.MODERATOR
}

export function isModerator(role: UserRole) {
  return role === UserRole.MODERATOR
}

export function canEditUser(currentUserId: string, targetUserId: string, currentUserRole: UserRole) {
  return currentUserId === targetUserId || isCurator(currentUserRole)
}

export function canModerateContent(role: UserRole) {
  return isModerator(role) || isCurator(role)
}

