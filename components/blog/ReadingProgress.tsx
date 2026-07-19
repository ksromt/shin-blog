'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

/**
 * Top-edge reading progress bar + back-to-top button for long articles.
 * scaleX transform keeps updates compositor-only (no layout/paint).
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement
        const max = doc.scrollHeight - doc.clientHeight
        setProgress(max > 0 ? doc.scrollTop / max : 0)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div
        aria-hidden
        className="fixed left-0 top-0 z-50 h-0.5 w-full origin-left bg-primary motion-reduce:hidden"
        style={{ transform: `scaleX(${progress})` }}
      />
      {progress > 0.3 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 h-10 w-10 rounded-full border border-border bg-card/80 text-muted-foreground shadow-md backdrop-blur transition-all hover:border-primary/50 hover:text-foreground animate-in fade-in-0 slide-in-from-bottom-2"
        >
          <ArrowUp className="mx-auto h-4 w-4" />
        </button>
      )}
    </>
  )
}
