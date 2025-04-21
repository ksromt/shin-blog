import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Mock data for code snippets
const snippets = [
]

export default function SnippetsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Code Snippets</h1>
      <p className="text-muted-foreground mb-8">coming soon.</p>

      <div className="grid gap-4 md:grid-cols-2">
        {snippets.map((snippet) => (
          <Link
            key={snippet.id}
            href={`/snippets/${snippet.id}`}
            className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-medium">{snippet.title}</h2>
              <Badge variant="outline" className="rounded-full bg-background">
                {snippet.language}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{snippet.description}</p>
            <p className="text-xs text-muted-foreground">{snippet.date}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
