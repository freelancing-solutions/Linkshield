import Link from 'next/link'
import Image from 'next/image'

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/logo.svg"
        alt="LinkShield"
        width={32}
        height={32}
        className="h-8 w-8"
        priority
      />
      <span className="text-xl font-bold text-gray-900 dark:text-white">
        LinkShield
      </span>
    </Link>
  )
}