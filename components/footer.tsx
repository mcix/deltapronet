import Link from 'next/link'
import { Logo } from './logo'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const drawingNumber = `DP-${currentYear}`

  return (
    <footer className="border-t border-border bg-background/95">
      <div className="container mx-auto flex justify-end px-4 py-8">
        <div className="w-full max-w-5xl">
          <div className="border border-border bg-background font-technical text-[11px] font-medium uppercase tracking-[0.14em] shadow-none">
            <div className="grid grid-cols-[140px_110px_100px_1fr] border-b border-border">
              <div className="border-r border-border px-3 py-2.5">
                <span className="block text-[9px] font-semibold tracking-[0.2em] text-muted-foreground">
                  PROJECT
                </span>
                <span className="mt-2 block whitespace-nowrap text-xs font-bold tracking-[0.1em]">
                  DELTAPRONET
                </span>
              </div>
              <div className="border-r border-border px-3 py-2.5">
                <span className="block text-[9px] font-semibold tracking-[0.2em] text-muted-foreground">
                  SCALE
                </span>
                <span className="mt-2 block whitespace-nowrap text-xs font-bold tracking-[0.1em]">
                  DIGITAL 1:1
                </span>
              </div>
              <div className="border-r border-border px-3 py-2.5">
                <span className="block text-[9px] font-semibold tracking-[0.2em] text-muted-foreground">
                  SHEET
                </span>
                <span className="mt-2 block whitespace-nowrap text-xs font-bold tracking-[0.1em]">
                  1 / 1
                </span>
              </div>
              <div className="px-4 py-2.5">
                <span className="block text-[9px] font-semibold tracking-[0.2em] text-muted-foreground">
                  TITLE
                </span>
                <span className="mt-1.5 block whitespace-nowrap text-sm font-bold tracking-[0.05em] normal-case">
                  DeltaProNet Skills & Knowledge Platform
                </span>
              </div>
            </div>

            <div className="grid grid-cols-[140px_110px_100px_1fr] border-b border-border">
              <div className="border-r border-border px-3 py-2.5">
                <span className="block text-[9px] font-semibold tracking-[0.2em] text-muted-foreground">
                  DRAWN BY
                </span>
                <span className="mt-2 block whitespace-nowrap text-[10px] font-bold tracking-[0.1em] normal-case">
                  DeltaProto Studio
                </span>
              </div>
              <div className="border-r border-border px-3 py-2.5">
                <span className="block text-[9px] font-semibold tracking-[0.2em] text-muted-foreground">
                  CHECKED
                </span>
                <span className="mt-2 block whitespace-nowrap text-[10px] font-bold tracking-[0.1em] normal-case">
                  Automated QA
                </span>
              </div>
              <div className="border-r border-border px-3 py-2.5">
                <span className="block text-[9px] font-semibold tracking-[0.2em] text-muted-foreground">
                  RELEASED
                </span>
                <span className="mt-2 block whitespace-nowrap text-[10px] font-bold tracking-[0.1em]">
                  {currentYear}.Q4
                </span>
              </div>
              <div className="px-4 py-2.5">
                <span className="block text-[9px] font-semibold tracking-[0.2em] text-muted-foreground">
                  CONTACT
                </span>
                <a
                  href="mailto:hello@deltaproto.com"
                  className="mt-2 block whitespace-nowrap text-[10px] font-bold tracking-[0.1em] normal-case text-brand-major hover:text-brand-major/80"
                >
                  hello@deltaproto.com
                </a>
              </div>
            </div>

            <div className="grid grid-cols-[140px_110px_100px_1fr] border-b border-border">
              <div className="border-r border-border px-3 py-2.5">
                <span className="block text-[9px] font-semibold tracking-[0.2em] text-muted-foreground">
                  CUSTOMER
                </span>
                <span className="mt-2 block whitespace-nowrap text-[10px] font-bold tracking-[0.1em] normal-case">
                  Tier 1 Partners
                </span>
              </div>
              <div className="border-r border-border px-3 py-2.5">
                <span className="block text-[9px] font-semibold tracking-[0.2em] text-muted-foreground">
                  DRAWING NO.
                </span>
                <span className="mt-2 block whitespace-nowrap text-[10px] font-bold tracking-[0.1em]">
                  {drawingNumber}
                </span>
              </div>
              <div className="border-r border-border px-3 py-2.5">
                <span className="block text-[9px] font-semibold tracking-[0.2em] text-muted-foreground">
                  DOC. NO.
                </span>
                <span className="mt-2 block whitespace-nowrap text-[10px] font-bold tracking-[0.1em]">
                  DPN-OPS-001
                </span>
              </div>
              <div className="px-4 py-2.5">
                <span className="block text-[9px] font-semibold tracking-[0.2em] text-muted-foreground">
                  LINKS
                </span>
                <ul className="mt-2 flex gap-3 text-[10px] font-sans normal-case tracking-normal">
                  <li>
                    <Link
                      href="/people"
                      className="whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Browse People
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/questions"
                      className="whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Q&A Forum
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-[250px_1fr]">
              <div className="border-r border-border px-3 py-3">
                <Logo />
                <p className="mt-3 font-sans text-[9px] normal-case tracking-[0.04em] text-muted-foreground">
                  © {currentYear} DeltaProto. All rights reserved.
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="flex-1 font-sans text-[9px] normal-case tracking-[0.06em] text-muted-foreground">
                  <p className="whitespace-nowrap">Prepared for high-fidelity engineering collaboration.</p>
                </div>
                <div className="whitespace-nowrap text-right font-sans text-[10px] normal-case tracking-[0.06em]">
                  <p className="font-bold">DeltaProNet</p>
                  <p className="text-muted-foreground">deltapronet.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

