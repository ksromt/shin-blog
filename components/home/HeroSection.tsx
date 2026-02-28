import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import siteMetadata from '@/data/siteMetadata'
import HomeButtons from './FeaturedLinks'

export default async function HomeLayout() {
  const t = await getTranslations('Home')

  return (
    <div className="mb-12 flex flex-col items-center gap-x-12 xl:flex-row">
      {/* Left text section */}
      <div className="pt-6 w-full xl:max-w-[75%]">
        <h1 className="pb-6 text-3xl font-extrabold leading-9 tracking-tight text-foreground sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          {t('greeting')}{' '}
          <span className="text-primary">{t('name')}</span>
        </h1>
        <h2 className="prose pt-5 text-lg text-muted-foreground">
          {t('welcome', { description: siteMetadata.description })}{' '}
          {t('freeTime')}
        </h2>
        <p className="pt-3 text-lg leading-7 text-muted-foreground">
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
        <p className="pt-5 text-lg leading-7 text-muted-foreground hidden sm:block">
          {t('reflection')}{' '}
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-primary/20 rounded-md animate-pulse"></span>
            <span className="relative">{t('reflectionHighlight')}&nbsp;</span>
          </span>
          {t('reflectionEnd')}
        </p>
        <div className="flex gap-4 mt-8">
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
      <div className="flex items-center justify-center">
        <HomeButtons />
      </div>
    </div>
  )
}
