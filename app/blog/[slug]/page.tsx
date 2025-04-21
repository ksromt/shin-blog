import type { Metadata } from "next"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

// Mock data for blog posts
const posts = [
  {
    id: "1",
    title: "How to get the Spotify Refresh Token",
    slug: "how-to-get-spotify-refresh-token",
    date: "July 12, 2022",
    views: 1234,
    content: `
      <p>Getting the Spotify Refresh Token doesn't need to be a hassle any longer.</p>
      
      <h2>What is a Refresh Token?</h2>
      <p>A refresh token is a special token that's used to obtain a new access token when the current access token becomes invalid or expires. This allows applications to have longer-term access without requiring the user to re-authenticate.</p>
      
      <h2>Step 1: Create a Spotify Developer Account</h2>
      <p>First, you'll need to create a Spotify Developer account and register your application.</p>
      
      <h2>Step 2: Set Up Your Application</h2>
      <p>Configure your application with the correct redirect URIs and permissions.</p>
      
      <h2>Step 3: Implement the Authorization Flow</h2>
      <p>Use the authorization code flow to get both an access token and a refresh token.</p>
      
      <h2>Step 4: Store Your Refresh Token</h2>
      <p>Securely store your refresh token for future use.</p>
      
      <h2>Step 5: Use the Refresh Token</h2>
      <p>When your access token expires, use the refresh token to get a new one without requiring the user to log in again.</p>
    `,
    tags: ["SPOTIFY", "HACKS"],
  },
  {
    id: "2",
    title: "Apple doesn't care about privacy, and it's showing.",
    slug: "apple-privacy-concerns",
    date: "July 6, 2022",
    views: 2345,
    content: `
      <p>Apple announced that it would begin checking content uploaded to iCloud Photos, against a list of known CSAM material. This is fine on it's own, however the system could easily be abused.</p>
      
      <h2>The Announcement</h2>
      <p>Apple recently announced a new system that would scan user photos for CSAM (Child Sexual Abuse Material) before they're uploaded to iCloud.</p>
      
      <h2>The Privacy Concerns</h2>
      <p>While the goal is noble, the implementation raises serious privacy concerns. This system could potentially be expanded to scan for other types of content at the request of governments or other entities.</p>
      
      <h2>The Slippery Slope</h2>
      <p>Once a backdoor exists, it can be widened. What starts as scanning for illegal content could evolve into scanning for political dissent or other content that certain governments might want to suppress.</p>
      
      <h2>The Hypocrisy</h2>
      <p>Apple has long positioned itself as a champion of privacy, but this move contradicts that stance. It shows that when pushed, Apple is willing to compromise on its privacy principles.</p>
    `,
    tags: ["APPLE", "TECH", "PRIVACY"],
  },
  {
    id: "3",
    title: "WWDC 2022 Wishlist",
    slug: "wwdc-2022-wishlist",
    date: "June 5, 2022",
    views: 1567,
    content: `
      <p>Even though I don't use any of their products myself, here's the features I hope Apple will announce.</p>
      
      <h2>iOS Improvements</h2>
      <p>More customization options for the home screen, better notification management, and improved privacy controls.</p>
      
      <h2>macOS Updates</h2>
      <p>Better window management, improved performance for older Macs, and more integration with iOS devices.</p>
      
      <h2>Developer Tools</h2>
      <p>Enhanced debugging capabilities, more powerful SwiftUI features, and better documentation.</p>
      
      <h2>Hardware Announcements</h2>
      <p>New MacBook Air with M2 chip, updated Mac Mini, and possibly a preview of the long-rumored AR/VR headset.</p>
    `,
    tags: ["TECH", "APPLE"],
  },
  {
    id: "4",
    title: "Apple and the case for competition",
    slug: "apple-case-for-competition",
    date: "September 23, 2021",
    views: 3456,
    content: `
      <p>Why Apple's closed ecosystem is harmful for innovation and consumer choice.</p>
      
      <h2>The Walled Garden</h2>
      <p>Apple's ecosystem is often described as a "walled garden" where everything works well together, but only if you stay within Apple's boundaries.</p>
      
      <h2>App Store Monopoly</h2>
      <p>Developers have no choice but to distribute their iOS apps through Apple's App Store, giving Apple significant control over what apps are available and allowing them to take a substantial cut of all transactions.</p>
      
      <h2>Repair Restrictions</h2>
      <p>Apple makes it difficult for users to repair their own devices or use third-party repair services, forcing consumers to pay Apple's premium repair prices or replace their devices entirely.</p>
      
      <h2>The Benefits of Competition</h2>
      <p>More competition would lead to more innovation, lower prices, and better options for consumers. It would push Apple to improve their products and services rather than relying on lock-in effects.</p>
    `,
    tags: ["APPLE", "TECH"],
  },
]

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = posts.find((post) => post.slug === params.slug)

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

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = posts.find((post) => post.slug === params.slug)

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
          <span>{post.date}</span>
          <span className="mx-2">•</span>
          <span>{post.views} views</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="rounded-full bg-background hover:bg-muted">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div
        className="prose prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  )
}
