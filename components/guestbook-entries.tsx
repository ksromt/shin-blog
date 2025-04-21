// Mock data for guestbook entries
const entries = [
]

export default function GuestbookEntries() {
  return (
    <div className="space-y-6">
      {entries.map((entry) => (
        <div key={entry.id} className="border-b pb-4">
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="font-medium">{entry.name}</h3>
            <span className="text-xs text-muted-foreground">{entry.date}</span>
          </div>
          <p className="text-sm">{entry.message}</p>
        </div>
      ))}
    </div>
  )
}
