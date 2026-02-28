'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h1 className="text-2xl font-bold mb-2">Failed to load blog posts</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        There was an error loading the blog. This might be a temporary issue.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
