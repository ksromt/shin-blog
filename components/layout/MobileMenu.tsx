"use client"

import { Fragment, useState } from "react"
import { Menu, Transition } from "@headlessui/react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { MenuIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { navigation } from "@/data/navigation"
import { useTranslations } from 'next-intl'

export default function MobileMenu() {
  const t = useTranslations('Navigation')
  const [isOpen, setIsOpen] = useState(false)

  const toggleIcon = () => {
    setIsOpen(!isOpen)
  }

  const handleMenuItemClick = () => {
    setIsOpen(false)
  }

  return (
    <Menu as="div" className="relative z-10 inline-block text-left sm:hidden">
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
                className="ml-2 rounded-full w-10 h-10 bg-muted ring-border transition-all hover:bg-primary/20 hover:ring-1"
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
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-border rounded-md bg-popover shadow-lg ring-1 ring-border focus:outline-none">
                <div className="py-1">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Menu.Item key={item.href}>
                        {({ active }) => (
                          <Link
                            href={item.href}
                            className={cn(
                              "block px-4 py-2 text-sm",
                              active
                                ? "bg-muted text-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                            onClick={handleMenuItemClick}
                          >
                            <div className="flex flex-row">
                              <Icon className="mr-4 mt-0.5 h-4 w-4" /> {t(item.titleKey)}
                            </div>
                          </Link>
                        )}
                      </Menu.Item>
                    )
                  })}
                </div>
              </Menu.Items>
            </Transition>
          </>
        )
      }}
    </Menu>
  )
}
