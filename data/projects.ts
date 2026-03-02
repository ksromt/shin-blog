export interface Project {
  id: string
  /** i18n key under "Projects" namespace for title */
  titleKey: string
  /** i18n key under "Projects" namespace for description */
  descKey: string
  technologies: string[]
  github: string
  /** Internal link (locale-aware) or null if no demo */
  demo: string | null
  featured: boolean
}

export const projects: Project[] = [
  {
    id: 'koclaw',
    titleKey: 'koclawTitle',
    descKey: 'koclawDesc',
    technologies: ['Rust', 'Python', 'Tokio', 'WebSocket', 'ChaCha20', 'MCP', 'GPT-SoVITS', 'Docker'],
    github: 'https://github.com/ksromt/koclaw',
    demo: null,
    featured: true,
  },
  {
    id: 'rag-research',
    titleKey: 'ragTitle',
    descKey: 'ragDesc',
    technologies: ['Python', 'LangChain', 'FastAPI', 'ChromaDB', 'OpenAI', 'Docker'],
    github: 'https://github.com/ksromt/rag-research',
    demo: null,
    featured: true,
  },
  {
    id: 'shin-blog',
    titleKey: 'shinBlogTitle',
    descKey: 'shinBlogDesc',
    technologies: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL', 'next-intl'],
    github: 'https://github.com/ksromt/shin-blog',
    demo: '/',
    featured: true,
  },
]
