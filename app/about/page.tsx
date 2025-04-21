import type { Metadata } from "next"
import { Github, Twitter, Mail } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About | ~/blog",
  description: "About the author of this blog",
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">About Me</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Coming soon.
        </p>
      </div>

      <div className="flex gap-4 mt-6">
        <Link
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Github className="h-5 w-5" />
          GitHub
        </Link>
        <Link
          href="https://twitter.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Twitter className="h-5 w-5" />
          Twitter
        </Link>
        <Link
          href=""
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Mail className="h-5 w-5" />
          Email
        </Link>
      </div>
    </div>
  )
}
