'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import siteMetadata from '@/data/siteMetadata'
import HomeButtons from './HomeButtons'

export default function HomeLayout() {
  return (
    <div className="mb-12 flex flex-col items-center gap-x-12 xl:flex-row">
      {/* 左侧文本部分 */}
      <div className="pt-6 max-w-[75%]">
        <h1 className="pb-6 text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          This is{' '}
          <span className="text-primary-500 dark:text-primary-dark-500">Shin</span>
        </h1>
        <h2 className="prose pt-5 text-lg text-gray-600 dark:text-gray-300">
          {`Welcome to ${siteMetadata.description}. I am a Graduate student in Computer Science at Keio University. `}
          In my free time, I like developing side projects and learning new technologies.
        </h2>
        <p className="pt-5 text-lg leading-7 text-slate-600 dark:text-slate-300 hidden sm:block">
          This is my place for{' '}
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-primary-500/20 rounded-md animate-pulse"></span>
            <span className="relative">thoughts, reflections & everything&nbsp;</span>
          </span>
          in between. Have a good read!
        </p>
        <div className="flex gap-4 mt-8">
          <Button asChild>
            <Link href="/blog">
              Read the blog
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/about">About me</Link>
          </Button>
        </div>
      </div>

      {/* 右侧按钮部分 */}
      <div className="flex items-center justify-center">
        <HomeButtons />
      </div>
    </div>
  )
} 