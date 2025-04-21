import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github } from "lucide-react"
import Link from "next/link"

// Mock data for projects
const projects = [
]

export default function ProjectsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Projects</h1>
      <p className="text-muted-foreground mb-8">coming soon.</p>

      <div className="grid gap-8 md:grid-cols-2">
        {projects.map((project) => (
          <div key={project.id} className="border rounded-lg overflow-hidden">
            <img src={project.image || "/placeholder.svg"} alt={project.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              <p className="text-muted-foreground mb-4">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="rounded-full bg-background">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-4">
                <Link
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm hover:underline"
                >
                  <Github className="h-4 w-4 mr-1" />
                  Source
                </Link>
                <Link
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm hover:underline"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Demo
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
