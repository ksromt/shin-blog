import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">Welcome to my blog</h1>
        <p className="text-xl text-muted-foreground">
          A personal space.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/blog">
              Read the blog
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/about">About me</Link>
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Latest Posts</h2>
        <Button variant="ghost" asChild className="gap-1">
          <Link href="/blog">
            View all posts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  )
}
