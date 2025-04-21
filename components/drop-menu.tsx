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

  const handleMenuItemClick = () => {
    setIsOpen(false)
  }

  return (
    <Menu as="div" className="relative z-10 inline-block text-left">
      {({ open }) => {
        if (open !== isOpen) {
          setIsOpen(open)
        }
        return (
          <>
            <div>
              <Menu.Button
                as={Button}
                variant="ghost"
                size="icon"
                className="ml-2 rounded-full w-10 h-10 bg-zinc-300 ring-zinc-400 transition-all hover:bg-violet-400 hover:ring-1 dark:bg-zinc-700 dark:ring-violet-700 dark:hover:bg-violet-600"
                onClick={toggleIcon}
                aria-label="Menu"
              >
                <motion.div
                  whileTap={{
                    scale: 0.5,
                  }}
                  transition={{ duration: 0.1, ease: "easeIn" }}
                  className="flex h-8 w-8 items-center justify-center"
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
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-zinc-300 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:divide-zinc-700 dark:bg-zinc-800">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/"
                        className={cn(
                          "block px-4 py-2 text-sm",
                          active
                            ? "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-300"
                            : "bg-white text-zinc-700 hover:bg-gray-300 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
                        )}
                        onClick={handleMenuItemClick}
                      >
                        <div className="flex flex-row">
                          <Home className="mr-4 mt-0.5 h-4 w-4" /> Home
                        </div>
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/blog"
                        className={cn(
                          "block px-4 py-2 text-sm",
                          active
                            ? "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-300"
                            : "bg-white text-zinc-700 hover:bg-gray-300 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
                        )}
                        onClick={handleMenuItemClick}
                      >
                        <div className="flex flex-row">
                          <FileText className="mr-4 mt-0.5 h-4 w-4" /> Blog
                        </div>
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/snippets"
                        className={cn(
                          "block px-4 py-2 text-sm",
                          active
                            ? "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-300"
                            : "bg-white text-zinc-700 hover:bg-gray-300 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
                        )}
                        onClick={handleMenuItemClick}
                      >
                        <div className="flex flex-row">
                          <Code className="mr-4 mt-0.5 h-4 w-4" /> Snippets
                        </div>
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/projects"
                        className={cn(
                          "block px-4 py-2 text-sm",
                          active
                            ? "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-300"
                            : "bg-white text-zinc-700 hover:bg-gray-300 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
                        )}
                        onClick={handleMenuItemClick}
                      >
                        <div className="flex flex-row">
                          <Briefcase className="mr-4 mt-0.5 h-4 w-4" /> Projects
                        </div>
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/about"
                        className={cn(
                          "block px-4 py-2 text-sm",
                          active
                            ? "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-300"
                            : "bg-white text-zinc-700 hover:bg-gray-300 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
                        )}
                        onClick={handleMenuItemClick}
                      >
                        <div className="flex flex-row">
                          <User className="mr-4 mt-0.5 h-4 w-4" /> About
                        </div>
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/guestbook"
                        className={cn(
                          "block px-4 py-2 text-sm",
                          active
                            ? "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-300"
                            : "bg-white text-zinc-700 hover:bg-gray-300 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
                        )}
                        onClick={handleMenuItemClick}
                      >
                        <div className="flex flex-row">
                          <MessageSquare className="mr-4 mt-0.5 h-4 w-4" /> Guestbook
                        </div>
                      </Link>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )
      }}
    </Menu>
  )
}
