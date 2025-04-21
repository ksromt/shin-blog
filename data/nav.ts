import { Home, FileText, Code, Briefcase, User, MessageSquare } from "lucide-react"

export const navigation = {
  pages: [
    { name: "Home", href: "/", icon: Home },
    { name: "Blog", href: "/blog", icon: FileText },
    { name: "Snippets", href: "/snippets", icon: Code },
    { name: "Projects", href: "/projects", icon: Briefcase },
    { name: "About", href: "/about", icon: User },
    { name: "Guestbook", href: "/guestbook", icon: MessageSquare },
  ],
}
