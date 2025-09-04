"use client"

import React, { useEffect, useState } from 'react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

export default function HealthIndicator() {
  const [status, setStatus] = useState<'loading' | 'operational' | 'degraded' | 'down'>('loading')

  useEffect(() => {
    let mounted = true

    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/health')
        if (!mounted) return
        if (!res.ok) {
          setStatus('degraded')
          return
        }
        const data = await res.json()
        setStatus(data.status || 'degraded')
      } catch (err) {
        if (!mounted) return
        setStatus('down')
      }
    }

    fetchStatus()
    const id = setInterval(fetchStatus, 60_000)
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [])

  const color =
    status === 'loading'
      ? 'bg-gray-400'
      : status === 'operational'
      ? 'bg-green-500'
      : status === 'degraded'
      ? 'bg-orange-400'
      : 'bg-red-500'

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`h-3 w-3 rounded-full ${color} mr-2`} aria-hidden />
      </TooltipTrigger>
      <TooltipContent sideOffset={4}>
        <span className="capitalize">{status}</span>
      </TooltipContent>
    </Tooltip>
  )
}
