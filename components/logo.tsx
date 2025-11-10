import Link from 'next/link'
import Image from 'next/image'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/deltaproto-logo.svg"
        alt="DeltaProto Logo"
        width={40}
        height={40}
        className="w-8 h-8 md:w-10 md:h-10"
      />
      <span className="font-bold text-lg md:text-xl">DeltaProNet</span>
    </Link>
  )
}

