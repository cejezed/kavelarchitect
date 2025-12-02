'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import React from 'react'

if (typeof window !== 'undefined') {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com'
  
  if (key) {
    posthog.init(key, {
      api_host: host,
      capture_pageview: false // Manual capture for Next.js routing often preferred, but auto is fine for MVP
    })
  }
}

export function PHProvider({ children }: { children?: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}