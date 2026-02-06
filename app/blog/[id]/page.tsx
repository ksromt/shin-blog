import type { Metadata } from "next"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { postRepository } from '@/lib/repositories'
import { formatDistanceToNow } from 'date-fns'
import MarkdownRenderer from '@/components/MarkdownRenderer'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = await postRepository.findById(id);

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | ~/blog`,
    description: post.content.substring(0, 160).replace(/<[^>]*>/g, ""),
  }
}

export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await postRepository.findById(id);

  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-3xl mx-auto">
      <Link href="/blog" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all posts
      </Link>

      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold">{post.title}</h1>

        <div className="flex items-center text-sm text-muted-foreground">
          <span>
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
          <span className="mx-2">•</span>
          <span>by {post.author.name}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag.id} variant="outline" className="rounded-full bg-background hover:bg-muted">
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MarkdownRenderer content={post.content} />
      </div>
    </article>
  )
}
