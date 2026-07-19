import type { Metadata } from "next"
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Github, Mail, Linkedin, Trophy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import siteMetadata from "@/data/siteMetadata"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  return {
    title: "About",
    description: t('aboutDescription'),
  }
}

const skills = [
  { category: "Languages", items: ["TypeScript", "Rust", "Python", "Java", "C++"] },
  { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Framer Motion"] },
  { category: "Backend", items: ["Node.js", "FastAPI", "PostgreSQL", "Prisma"] },
  { category: "Tools", items: ["Git", "Docker", "Linux", "VS Code"] },
  { category: "AI/ML", items: ["LangChain", "OpenAI API", "RAG", "Vector DBs"] },
]

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('About')

  const timeline = [
    {
      period: t('masterPeriod'),
      title: t('masterTitle'),
      description: t('masterDesc'),
    },
    {
      period: t('bachelorPeriod'),
      title: t('bachelorTitle'),
      description: t('bachelorDesc'),
    },
  ]

  const achievements = [
    t('achievement1'),
    t('achievement2'),
    t('achievement3'),
  ]

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header: Avatar + Name + Bio */}
      <div className="flex flex-col sm:flex-row items-start gap-8 mb-12">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-border shrink-0">
          <Image
            src={siteMetadata.image}
            alt={t('name')}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p dangerouslySetInnerHTML={{ __html: t.raw('intro') }} />
            <p>{t('freeTime')}</p>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="flex flex-wrap gap-4 mb-12">
        <Link
          href={siteMetadata.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
        >
          <Github className="h-5 w-5" />
          GitHub
        </Link>
        <Link
          href={siteMetadata.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
        >
          <Linkedin className="h-5 w-5" />
          LinkedIn
        </Link>
        <Link
          href={`mailto:${siteMetadata.email}`}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
        >
          <Mail className="h-5 w-5" />
          Email
        </Link>
      </div>

      {/* Skills */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">{t('skills')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {skills.map((group) => (
            <div key={group.category} className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="px-2.5 py-1 text-sm bg-muted rounded-md">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline: Education */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">{t('experience')}</h2>
        <div className="space-y-8">
          {timeline.map((entry) => (
            <div key={entry.period} className="relative pl-6 border-l-2 border-border">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary" />
              <p className="text-sm text-muted-foreground mb-1">{entry.period}</p>
              <h3 className="font-semibold mb-1">{entry.title}</h3>
              <p className="text-muted-foreground text-sm">{entry.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section>
        <h2 className="text-2xl font-bold mb-6">{t('achievementsTitle')}</h2>
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-border">
              <Trophy className="h-5 w-5 text-glow-c shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground">{achievement}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
