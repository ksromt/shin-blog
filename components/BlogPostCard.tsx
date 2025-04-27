import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

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
  // Convert string date to Date object if needed
  const postDate = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
  
  // Create a snippet from content (first 150 chars)
  const contentSnippet = content.length > 150
    ? `${content.substring(0, 150)}...`
    : content;

  return (
    <div className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-2xl font-bold mb-2">
        <Link href={`/blog/${id}`} className="text-blue-600 hover:text-blue-800">
          {title}
        </Link>
      </h2>
      
      <div className="flex items-center mb-4 text-sm text-gray-600">
        <div className="flex items-center">
          {author.image ? (
            <span className="w-6 h-6 rounded-full overflow-hidden mr-2">
              <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
            </span>
          ) : (
            <span className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center mr-2">
              {author.name.charAt(0).toUpperCase()}
            </span>
          )}
          <span>{author.name}</span>
        </div>
        <span className="mx-2">•</span>
        <time dateTime={postDate.toISOString()}>
          {formatDistanceToNow(postDate, { addSuffix: true })}
        </time>
      </div>
      
      <p className="mb-4 text-gray-700">{contentSnippet}</p>
      
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span 
            key={tag.id} 
            className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
          >
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  );
} 