"use client"

import { Dialog, Combobox, Transition } from "@headlessui/react"
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
        className="rounded-full"
        onClick={() => setIsOpen(true)}
        aria-label="Command palette"
      >
        <Command className="h-4 w-4" />
      </Button>

      <Transition.Root show={isOpen} as={Fragment} afterLeave={() => setQuery("")}>
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20" onClose={setIsOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500/25 backdrop-blur-sm transition-opacity dark:bg-gray-900/50" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Combobox
              as="div"
              className="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all dark:divide-gray-700 dark:bg-gray-800 dark:ring-white/10"
              onChange={(page: any) => {
                setIsOpen(false)
                router.push(page.href)
              }}
            >
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500"
                  aria-hidden="true"
                />
                <Combobox.Input
                  className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 dark:text-gray-200 dark:placeholder-gray-500 sm:text-sm"
                  placeholder="Search..."
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>

              {filteredPages.length > 0 && (
                <Combobox.Options static className="max-h-96 scroll-py-3 overflow-y-auto p-3">
                  {filteredPages.map((page: any) => (
                    <Combobox.Option
                      key={page.href}
                      value={page}
                      className={({ active }) =>
                        cn(
                          "flex cursor-default select-none rounded-xl p-3",
                          active ? "bg-gray-100 dark:bg-gray-700" : "",
                        )
                      }
                    >
                      {({ active }) => {
                        const IconComponent = page.icon
                        return (
                          <>
                            <div
                              className={cn(
                                "flex h-10 w-10 flex-none items-center justify-center rounded-lg",
                                active ? "bg-gray-800 dark:bg-gray-700" : "bg-gray-500 dark:bg-gray-600",
                              )}
                            >
                              {IconComponent && <IconComponent className="h-6 w-6 text-white" aria-hidden="true" />}
                            </div>
                            <div className="ml-4 flex-auto">
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  active ? "text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-400",
                                )}
                              >
                                {page.name}
                              </p>
                              {page.description && (
                                <p
                                  className={cn(
                                    "text-sm",
                                    active ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500",
                                  )}
                                >
                                  {page.description}
                                </p>
                              )}
                            </div>
                          </>
                        )
                      }}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              )}

              {query !== "" && filteredPages.length === 0 && (
                <div className="px-6 py-14 text-center text-sm sm:px-14">
                  <p className="text-gray-500 dark:text-gray-400">No pages found.</p>
                </div>
              )}
            </Combobox>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </>
  )
}
