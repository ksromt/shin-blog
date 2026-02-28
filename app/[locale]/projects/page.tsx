import type { Metadata } from "next"
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, Star } from "lucide-react"
import Link from "next/link"
import { projects } from "@/data/projects"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const tMeta = await getTranslations({ locale, namespace: 'Metadata' })
  return {
    title: tMeta('projectsDescription'),
  }
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Projects')
  const featured = projects.filter((p) => p.featured)
  const others = projects.filter((p) => !p.featured)

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
      <p className="text-muted-foreground mb-8">{t('subtitle')}</p>

      {featured.length > 0 && (
        <div className="space-y-6 mb-12">
          {featured.map((project) => (
            <div key={project.id} className="p-6 border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-semibold">{t(project.titleKey)}</h2>
                    <Badge className="bg-primary/10 text-primary border-0 text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      {t('featured')}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{t(project.descKey)}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="rounded-full bg-background">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-4">
                <Link
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-4 w-4 mr-1.5" />
                  {t('source')}
                </Link>
                {project.demo && (
                  <Link
                    href={project.demo}
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mr-1.5" />
                    {project.demo.startsWith("/") ? t('tryIt') : t('demo')}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {others.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4">{t('otherProjects')}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {others.map((project) => (
              <div key={project.id} className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">{t(project.titleKey)}</h3>
                <p className="text-sm text-muted-foreground mb-3">{t(project.descKey)}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs rounded-full bg-background">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-4">
                  <Link
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="h-4 w-4 mr-1" />
                    {t('source')}
                  </Link>
                  {project.demo && (
                    <Link
                      href={project.demo}
                      className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      {t('demo')}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
