// Mock data for guestbook entries
interface GuestbookEntry {
  id: string;
  name: string;
  date: string;
  message: string;
}

const entries: GuestbookEntry[] = [
  {
    id: "1",
    name: "张三",
    date: "2024-03-20",
    message: "这是一个测试留言"
  },
  {
    id: "2",
    name: "李四",
    date: "2024-03-21",
    message: "这是另一个测试留言"
  }
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
