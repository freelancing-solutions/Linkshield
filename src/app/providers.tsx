"use client"

import React from 'react'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'

interface ProvidersProps {
  children: React.ReactNode
  session?: any
}

export default function Providers({ children, session }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="system">
      <SessionProvider session={session}>{children}</SessionProvider>
    </ThemeProvider>
  )
}
