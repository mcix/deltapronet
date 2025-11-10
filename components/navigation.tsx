'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Logo } from '@/components/logo'
import { Menu, Users, MessageSquare, User, LogOut, Settings, Shield } from 'lucide-react'
import { UserRole } from '@prisma/client'

export function Navigation() {
  const { data: session } = useSession()

  const navLinks = [
    { href: '/people', label: 'People', icon: Users },
    { href: '/questions', label: 'Q&A', icon: MessageSquare },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo />
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button variant="ghost" className="gap-2">
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                      <AvatarFallback>
                        {session.user.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user.name && (
                        <p className="font-medium">{session.user.name}</p>
                      )}
                      {session.user.email && (
                        <p className="text-sm text-muted-foreground">{session.user.email}</p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {(session.user.role === UserRole.CURATOR || session.user.role === UserRole.MODERATOR) && (
                    <DropdownMenuItem asChild>
                      <Link href="/curator" className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        Curator Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => signIn('linkedin')}>Sign in with LinkedIn</Button>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Button>
                  </Link>
                ))}
                
                <div className="border-t pt-4">
                  {session ? (
                    <>
                      <div className="flex items-center gap-2 p-2 mb-4">
                        <Avatar>
                          <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                          <AvatarFallback>
                            {session.user.name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{session.user.name}</p>
                          <p className="text-sm text-muted-foreground">{session.user.email}</p>
                        </div>
                      </div>
                      <Link href="/dashboard">
                        <Button variant="ghost" className="w-full justify-start gap-2 mb-2">
                          <User className="h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                      {(session.user.role === UserRole.CURATOR || session.user.role === UserRole.MODERATOR) && (
                        <Link href="/curator">
                          <Button variant="ghost" className="w-full justify-start gap-2 mb-2">
                            <Shield className="h-4 w-4" />
                            Curator Dashboard
                          </Button>
                        </Link>
                      )}
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-2"
                        onClick={() => signOut()}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <Button className="w-full" onClick={() => signIn('linkedin')}>
                      Sign in with LinkedIn
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

