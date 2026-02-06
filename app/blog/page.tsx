import { SearchIcon } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { postRepository } from '@/lib/repositories'
import { formatDistanceToNow } from 'date-fns'

export default async function BlogPage() {
  const posts = await postRepository.findPublished();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">All Posts</h1>

      <div className="relative mb-8">
        <Input type="text" placeholder="Search articles" className="pr-10" />
        <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      <div className="border-t border-border" />

      <div className="space-y-12 mt-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <article key={post.id} className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                <span className="mx-2">•</span>
                <span>by {post.author.name}</span>
              </div>

              <Link href={`/blog/${post.id}`} className="block">
                <h2 className="text-2xl font-semibold hover:underline">{post.title}</h2>
              </Link>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="rounded-full bg-background hover:bg-muted">
                    {tag.name}
                  </Badge>
                ))}
              </div>

              <p className="text-muted-foreground">
                {post.content.length > 200
                  ? `${post.content.substring(0, 200)}...`
                  : post.content
                }
              </p>
            </article>
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">尚未发布文章</h3>
            <p className="text-muted-foreground mb-4">
              博客文章将在发布后显示在这里。
            </p>
            <Link
              href="/arcadiaedenAdmin"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              创建第一篇文章
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
