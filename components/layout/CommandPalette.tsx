"use client"

import { Dialog, Transition } from "@headlessui/react"
import { useState, useEffect, Fragment } from "react"
import { Search, Command } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { navigation, type NavItem } from "@/data/navigation"
import { useTranslations } from 'next-intl'

export default function CommandPalette() {
  const router = useRouter()
  const t = useTranslations('Navigation')
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

  const filteredItems: NavItem[] =
    query === ""
      ? navigation
      : navigation.filter((item) =>
          t(item.titleKey).toLowerCase().includes(query.toLowerCase())
        )

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
            <div className="fixed inset-0 bg-background/50 backdrop-blur-sm transition-opacity" />
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
              <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-border overflow-hidden rounded-xl bg-popover shadow-2xl ring-1 ring-border transition-all">
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-foreground placeholder-muted-foreground focus:ring-0 sm:text-sm"
                    placeholder={t('search')}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>

                {filteredItems.length > 0 && (
                  <div className="max-h-96 scroll-py-3 overflow-y-auto p-3">
                    {filteredItems.map((item) => {
                      const IconComponent = item.icon
                      return (
                        <button
                          key={item.href}
                          className={cn(
                            "flex w-full cursor-default select-none items-center rounded-xl p-3",
                            "hover:bg-muted"
                          )}
                          onClick={() => {
                            setIsOpen(false)
                            router.push(item.href)
                          }}
                        >
                          <div
                            className={cn(
                              "flex h-10 w-10 flex-none items-center justify-center rounded-lg",
                              "bg-primary/10"
                            )}
                          >
                            <IconComponent className="h-6 w-6 text-primary" aria-hidden="true" />
                          </div>
                          <div className="ml-4 flex-auto text-left">
                            <p className="text-sm font-medium text-foreground">
                              {t(item.titleKey)}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

                {query !== "" && filteredItems.length === 0 && (
                  <div className="px-6 py-14 text-center text-sm sm:px-14">
                    <p className="text-muted-foreground">{t('noResults')}</p>
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
