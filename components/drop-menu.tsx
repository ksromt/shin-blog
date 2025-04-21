"use client"

import { Fragment, useState } from "react"
import { Menu, Transition } from "@headlessui/react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Home, FileText, Code, Briefcase, User, MessageSquare, MenuIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DropMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleIcon = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Menu as="div" className="relative ml-1">
      <div>
        <Menu.Button
          as={Button}
          variant="ghost"
          size="icon"
          className="rounded-full md:hidden"
          onClick={toggleIcon}
          aria-label="Menu"
        >
          <motion.div
            whileTap={{
              scale: 0.7,
              rotate: 360,
            }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2, ease: "easeIn" }}
          >
            {isOpen ? <X className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </motion.div>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:divide-gray-700 dark:bg-gray-800 dark:ring-white/10">
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/"
                  className={cn(
                    "group flex w-full items-center rounded-md px-2 py-2 text-sm",
                    active
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                      : "text-gray-700 dark:text-gray-200",
                  )}
                >
                  <Home className="mr-2 h-5 w-5" />
                  Home
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/blog"
                  className={cn(
                    "group flex w-full items-center rounded-md px-2 py-2 text-sm",
                    active
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                      : "text-gray-700 dark:text-gray-200",
                  )}
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Blog
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/snippets"
                  className={cn(
                    "group flex w-full items-center rounded-md px-2 py-2 text-sm",
                    active
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                      : "text-gray-700 dark:text-gray-200",
                  )}
                >
                  <Code className="mr-2 h-5 w-5" />
                  Snippets
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/projects"
                  className={cn(
                    "group flex w-full items-center rounded-md px-2 py-2 text-sm",
                    active
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                      : "text-gray-700 dark:text-gray-200",
                  )}
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Projects
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/about"
                  className={cn(
                    "group flex w-full items-center rounded-md px-2 py-2 text-sm",
                    active
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                      : "text-gray-700 dark:text-gray-200",
                  )}
                >
                  <User className="mr-2 h-5 w-5" />
                  About
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/guestbook"
                  className={cn(
                    "group flex w-full items-center rounded-md px-2 py-2 text-sm",
                    active
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                      : "text-gray-700 dark:text-gray-200",
                  )}
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Guestbook
                </Link>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
