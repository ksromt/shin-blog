import { SearchIcon } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// Mock data for blog posts
const posts = [
]

export default function BlogPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">All Posts</h1>

      <div className="relative mb-8">
        <Input type="text" placeholder="Search articles" className="pr-10" />
        <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      <div className="border-t border-border" />

      <div className="space-y-12 mt-8">
        {posts.map((post) => (
          <article key={post.id} className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <span>{post.date}</span>
              <span className="mx-2">•</span>
              <span>{post.views} views</span>
            </div>

            <Link href={`/blog/${post.slug}`} className="block">
              <h2 className="text-2xl font-semibold hover:underline">{post.title}</h2>
            </Link>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-full bg-background hover:bg-muted">
                  {tag}
                </Badge>
              ))}
            </div>

            <p className="text-muted-foreground">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
