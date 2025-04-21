import type { Metadata } from "next"
import GuestbookForm from "@/components/guestbook-form"
import GuestbookEntries from "@/components/guestbook-entries"

export const metadata: Metadata = {
  title: "Guestbook | ~/blog",
  description: "Sign my guestbook and leave a message",
}

export default function GuestbookPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Guestbook</h1>
      <p className="text-muted-foreground mb-8">Coming soon!</p>

      <GuestbookForm />

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Messages</h2>
        <GuestbookEntries />
      </div>
    </div>
  )
}
