import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import siteMetadata from '@/data/siteMetadata'
import HomeButtons from './FeaturedLinks'

export default async function HomeLayout() {
  const t = await getTranslations('Home')

  return (
    <div className="flex flex-col gap-10 xl:flex-row xl:items-center xl:gap-12">
      {/* Left text section */}
      <div className="w-full space-y-5 xl:min-w-0 xl:flex-1">
        <h1 className="font-display text-3xl font-extrabold leading-tight text-foreground sm:text-4xl md:text-6xl motion-safe:animate-fade-up">
          {t('greeting')}{' '}
          <span className="text-primary">{t('name')}</span>
        </h1>
        <p className="text-lg leading-8 text-muted-foreground motion-safe:animate-fade-up motion-safe:[animation-delay:100ms]">
          {t('welcome', { description: siteMetadata.description })}{' '}
          {t('freeTime')}
        </p>
        <p className="text-lg leading-8 text-muted-foreground motion-safe:animate-fade-up motion-safe:[animation-delay:180ms]">
          {t.rich('kokoronIntro', {
            kokoronLink: (chunks) => (
              <Link href="/ask" className="text-primary hover:underline font-semibold">
                {chunks}
              </Link>
            ),
            contactLink: (chunks) => (
              <Link href="/about" className="text-primary hover:underline font-semibold">
                {chunks}
              </Link>
            ),
          })}
        </p>
        <p className="hidden text-lg leading-8 text-muted-foreground sm:block motion-safe:animate-fade-up motion-safe:[animation-delay:260ms]">
          {t('reflection')}{' '}
          <span className="relative inline-block">
            <span className="absolute inset-0 origin-left rounded-md bg-primary/20 motion-safe:animate-highlight-in"></span>
            <span className="relative">{t('reflectionHighlight')}&nbsp;</span>
          </span>
          {t('reflectionEnd')}
        </p>
        <div className="flex gap-4 pt-3 motion-safe:animate-fade-up motion-safe:[animation-delay:340ms]">
          <Button asChild>
            <Link href="/blog">
              {t('readBlog')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/about">{t('aboutMe')}</Link>
          </Button>
        </div>
      </div>

      {/* Right buttons section */}
      <div className="xl:shrink-0 motion-safe:animate-fade-up motion-safe:[animation-delay:420ms]">
        <HomeButtons />
      </div>
    </div>
  )
}
