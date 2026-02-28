import Link from "next/link"
import { getTranslations } from 'next-intl/server'
import siteMetadata from "@/data/siteMetadata"

export default async function Footer() {
  const t = await getTranslations('Footer')
  const currentYear = new Date().getFullYear()
  const currentDay = new Date().toLocaleDateString("en-US", { weekday: "long" })

  return (
    <footer className="mt-10">
      <div className="flex flex-col items-center">
        <div className="mb-2 hidden text-sm text-muted-foreground md:flex">
          <div className="mx-1">
            <Link href="/" className="hover:underline">
              {t('copyright', { author: siteMetadata.author, year: currentYear })}
            </Link>
          </div>
          {`\u2022`}
          <div className="mx-1">
            <Link href="/" className="hover:underline">
              {t('haveAGood', { day: currentDay })}
            </Link>
          </div>
          {`\u2022`}
          <div className="mx-1">
            <Link href="/about" className="hover:underline">
              {t('contact')}
            </Link>
          </div>
        </div>
        <div className="mb-2 text-sm text-muted-foreground sm:block md:hidden">
          <div className="mx-1">
            <Link href="/" className="hover:underline">
              {t('copyright', { author: siteMetadata.author, year: currentYear })}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
