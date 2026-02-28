import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import ContactCard from './ContactCard'

export default async function HomeButtons() {
  const t = await getTranslations('Home')

  return (
    <div className="flex items-center justify-center">
      <div className="grid grid-cols-1 grid-rows-3 gap-8 py-12">
        {/* What I built button */}
        <div className="my-2 grid items-start gap-8">
          <div className="group relative">
            <div className="animate-tilt absolute -inset-0.5 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 opacity-50 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
            <Link href="/projects">
              <span className="relative flex items-center divide-x divide-border rounded-lg bg-card px-7 py-4 leading-none whitespace-nowrap">
                <span className="flex items-center space-x-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 -rotate-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                  <span className="pr-6 text-foreground">{t('whatIBuilt')}</span>
                </span>
                <span className="pl-6 text-amber-400 transition duration-200 group-hover:text-foreground">
                  {t('projectsArrow')}&nbsp;&rarr;
                </span>
              </span>
            </Link>
          </div>
        </div>

        {/* Read my story button */}
        <div className="my-2 grid items-start gap-8">
          <div className="group relative">
            <div className="animate-tilt absolute -inset-0.5 rounded-lg bg-gradient-to-r from-fuchsia-600 to-emerald-600 opacity-50 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
            <Link href="/about">
              <span className="relative flex items-center divide-x divide-border rounded-lg bg-card px-7 py-4 leading-none whitespace-nowrap">
                <span className="flex items-center space-x-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 -rotate-6 text-pink-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span className="pr-6 text-foreground">{t('readMyStory')}</span>
                </span>
                <span className="pl-6 text-indigo-400 transition duration-200 group-hover:text-foreground">
                  {t('aboutArrow')}&nbsp;&rarr;
                </span>
              </span>
            </Link>
          </div>
        </div>

        {/* Contact button — client component with popup modal */}
        <ContactCard />
      </div>
    </div>
  )
}
