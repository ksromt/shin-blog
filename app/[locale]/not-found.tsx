import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, FileText, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-8xl font-bold text-muted-foreground/20 select-none mb-4">404</div>
      <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/blog">
            <FileText className="mr-2 h-4 w-4" />
            Read the Blog
          </Link>
        </Button>
      </div>
    </div>
  )
}
