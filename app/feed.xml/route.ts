import { postRepository } from '@/lib/repositories'
import siteMetadata from '@/data/siteMetadata'
import { escapeXml } from '@/lib/utils/xml'

// Force dynamic rendering — RSS feed queries the DB
export const dynamic = 'force-dynamic'

export async function GET() {
  const posts = await postRepository.findPublished()

  const items = posts.map((post) => {
    const url = `${siteMetadata.siteUrl}/en/blog/${post.slug || post.id}`
    const description = post.content.substring(0, 300).replace(/[#*`]/g, '')
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      ${post.tags.map((t) => `<category>${escapeXml(t.name)}</category>`).join('\n      ')}
    </item>`
  })

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteMetadata.title)}</title>
    <link>${siteMetadata.siteUrl}</link>
    <description>${escapeXml(siteMetadata.description)}</description>
    <language>${siteMetadata.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteMetadata.siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items.join('\n')}
  </channel>
</rss>`

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
