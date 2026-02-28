import { Skeleton } from '@/components/ui/skeleton'

export default function BlogLoading() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">All Posts</h1>
      <Skeleton className="h-10 w-full mb-8" />
      <div className="border-t border-border" />
      <div className="space-y-12 mt-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-7 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
