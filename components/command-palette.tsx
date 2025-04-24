"use client"

import { Dialog, Transition } from "@headlessui/react"
import { useState, useEffect, Fragment } from "react"
import { Search, Command } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function CommandPalette({ navigation }: { navigation: any }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setIsOpen(!isOpen)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  const filteredPages =
    query === ""
      ? navigation.pages
      : navigation.pages.filter((page: any) => {
          return page.name.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full w-10 h-10"
        onClick={() => setIsOpen(true)}
        aria-label="Command palette"
      >
        <Command className="h-5 w-5" />
      </Button>

      <Transition show={isOpen} as={Fragment}>
        <Dialog className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500/25 backdrop-blur-sm transition-opacity dark:bg-gray-900/50" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all dark:divide-gray-700 dark:bg-gray-800 dark:ring-white/10">
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500"
                    aria-hidden="true"
                  />
                  <input
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 dark:text-gray-200 dark:placeholder-gray-500 sm:text-sm"
                    placeholder="Search..."
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>

                {filteredPages.length > 0 && (
                  <div className="max-h-96 scroll-py-3 overflow-y-auto p-3">
                    {filteredPages.map((page: any) => {
                      const IconComponent = page.icon
                      return (
                        <button
                          key={page.href}
                          className={cn(
                            "flex w-full cursor-default select-none items-center rounded-xl p-3",
                            "hover:bg-gray-100 dark:hover:bg-gray-700"
                          )}
                          onClick={() => {
                            setIsOpen(false)
                            router.push(page.href)
                          }}
                        >
                          <div
                            className={cn(
                              "flex h-10 w-10 flex-none items-center justify-center rounded-lg",
                              "bg-gray-500 dark:bg-gray-600"
                            )}
                          >
                            {IconComponent && <IconComponent className="h-6 w-6 text-white" aria-hidden="true" />}
                          </div>
                          <div className="ml-4 flex-auto">
                            <p
                              className={cn(
                                "text-sm font-medium",
                                "text-gray-700 dark:text-gray-400"
                              )}
                            >
                              {page.name}
                            </p>
                            {page.description && (
                              <p
                                className={cn(
                                  "text-sm",
                                  "text-gray-400 dark:text-gray-500"
                                )}
                              >
                                {page.description}
                              </p>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

                {query !== "" && filteredPages.length === 0 && (
                  <div className="px-6 py-14 text-center text-sm sm:px-14">
                    <p className="text-gray-500 dark:text-gray-400">No pages found.</p>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
