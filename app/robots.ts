import siteMetadata from '@/data/siteMetadata'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/arcadiaedenAdmin/'],
      },
    ],
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
  }
}
