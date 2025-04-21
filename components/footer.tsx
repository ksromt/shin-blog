"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer>
      <div className="mt-10 flex flex-col items-center">
        <div className="mb-2 hidden text-sm text-muted-foreground md:flex">
          <div className="mx-1">
            <Link href="/" className="hover:underline">
              Your Name{` © ${new Date().getFullYear()}`}
            </Link>
          </div>
          {`•`}
          <div className="mx-1">
            <Link href="/" className="hover:underline">
              Have a good {new Date().toLocaleDateString("en-US", { weekday: "long" })}!
            </Link>
          </div>
          {`•`}
          <div className="mx-1">
            <Link href="/about" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
        <div className="mb-2 text-sm text-muted-foreground sm:block md:hidden lg:hidden">
          <div className="mx-1">
            <Link href="/" className="hover:underline">
              Your Name{` © ${new Date().getFullYear()}`}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
