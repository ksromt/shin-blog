import type { Metadata } from "next"
import { prisma } from '@/lib/prisma/prisma';
import GuestbookForm from "@/components/GuestbookForm"
import { formatDistanceToNow } from 'date-fns';

interface GuestbookEntry {
  id: string;
  message: string;
  createdAt: Date;
  author: {
    name: string | null;
    image: string | null;
  };
}

export const metadata: Metadata = {
  title: "Guestbook | ~/blog",
  description: "Sign my guestbook and leave a message",
}

async function getGuestbookEntries(): Promise<GuestbookEntry[]> {
  try {
    const entries = await prisma.guestbook.findMany({
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return entries as GuestbookEntry[];
  } catch (error) {
    console.error('Error fetching guestbook entries:', error);
    return [];
  }
}

export default async function GuestbookPage() {
  const entries = await getGuestbookEntries();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">留言簿</h1>
      
      <GuestbookForm />
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">最近的留言</h2>
        
        {entries.length > 0 ? (
          <div className="space-y-6">
            {entries.map((entry: GuestbookEntry) => (
              <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex gap-2 items-center mb-2">
                  {entry.author.image ? (
                    <img 
                      src={entry.author.image} 
                      alt={entry.author.name || '用户头像'} 
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      {entry.author.name?.[0] || '?'}
                    </div>
                  )}
                  <span className="font-medium">{entry.author.name}</span>
                  <span className="text-gray-500 text-sm">
                    {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                  </span>
                </div>
                
                <p className="text-gray-700">{entry.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            还没有留言，成为第一个留言的人吧！
          </div>
        )}
      </div>
    </div>
  )
}
