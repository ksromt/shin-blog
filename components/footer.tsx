"use client"

import Link from "next/link"
import siteMetadata from "@/data/siteMetadata"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const currentDay = new Date().toLocaleDateString("en-US", { weekday: "long" })

  return (
    <footer className="mt-10">
      <div className="flex flex-col items-center">
        <div className="mb-2 hidden text-sm text-muted-foreground md:flex">
          <div className="mx-1">
            <Link href="/" className="hover:underline">
              {siteMetadata.author}{` © ${currentYear}`}
            </Link>
          </div>
          {`•`}
          <div className="mx-1">
            <Link href="/" className="hover:underline">
              Have a good {currentDay}!
            </Link>
          </div>
          {`•`}
          <div className="mx-1">
            <Link href="/about" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
        <div className="mb-2 text-sm text-muted-foreground sm:block md:hidden">
          <div className="mx-1">
            <Link href="/" className="hover:underline">
              {siteMetadata.author}{` © ${currentYear}`}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
