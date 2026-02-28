import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { stripMarkdown } from '@/lib/utils';

interface Author {
  name: string;
  image?: string | null;
}

interface Tag {
  id: string;
  name: string;
}

interface BlogPostCardProps {
  id: string;
  title: string;
  content: string;
  author: Author;
  createdAt: string | Date;
  tags: Tag[];
}

export default function BlogPostCard({
  id,
  title,
  content,
  author,
  createdAt,
  tags,
}: BlogPostCardProps) {
  const postDate = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
  const contentSnippet = stripMarkdown(content).substring(0, 150);

  return (
    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
      <h2 className="text-2xl font-bold mb-2">
        <Link href={`/blog/${id}`} className="text-primary hover:text-primary/80">
          {title}
        </Link>
      </h2>

      <div className="flex items-center mb-4 text-sm text-muted-foreground">
        <div className="flex items-center">
          {author.image ? (
            <span className="w-6 h-6 rounded-full overflow-hidden mr-2 relative">
              <Image
                src={author.image}
                alt={author.name}
                width={24}
                height={24}
                className="object-cover"
              />
            </span>
          ) : (
            <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center mr-2 text-xs">
              {author.name.charAt(0).toUpperCase()}
            </span>
          )}
          <span>{author.name}</span>
        </div>
        <span className="mx-2">&bull;</span>
        <time dateTime={postDate.toISOString()}>
          {formatDistanceToNow(postDate, { addSuffix: true })}
        </time>
      </div>

      <p className="mb-4 text-muted-foreground">
        {contentSnippet}{contentSnippet.length >= 150 ? '...' : ''}
      </p>

      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span
            key={tag.id}
            className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
          >
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  );
}
