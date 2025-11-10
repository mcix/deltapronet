import Link from 'next/link'
import { Logo } from './logo'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Logo />
            <p className="text-sm text-muted-foreground">
              A curated database of skilled engineers and professionals managed by DeltaProto.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Navigate</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/people" className="text-muted-foreground hover:text-foreground transition-colors">
                  Browse People
                </Link>
              </li>
              <li>
                <Link href="/questions" className="text-muted-foreground hover:text-foreground transition-colors">
                  Q&A Forum
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">About</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://deltaproto.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  DeltaProto
                </a>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About DeltaProNet
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} DeltaProto. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

