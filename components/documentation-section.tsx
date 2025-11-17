"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, ExternalLink, ChevronDown, FileText, Code, Globe } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"

interface DocumentationItem {
  title: string
  url: string
  type: "article" | "documentation" | "github" | "tutorial"
  source: string
}

interface DocumentationSectionProps {
  videoId: string
  videoTitle: string
  resources: DocumentationItem[]
  isLoading?: boolean
  onAddResource: (resource: DocumentationItem) => void
}

export function DocumentationSection({ videoId, videoTitle, resources, isLoading = false, onAddResource }: DocumentationSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newUrl, setNewUrl] = useState("")

  const handleAddResource = () => {
    if (newTitle && newUrl) {
      const newResource: DocumentationItem = {
        title: newTitle,
        url: newUrl,
        type: "documentation", // Default type for added resources
        source: new URL(newUrl).hostname, // Extract the hostname from the URL
      }
      onAddResource(newResource)
      setNewTitle("")
      setNewUrl("")
    }
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="h-4 w-4 text-white" />
      case "documentation":
        return <BookOpen className="h-4 w-4 text-white" />
      case "github":
        return <Code className="h-4 w-4 text-white" />
      case "tutorial":
        return <Globe className="h-4 w-4 text-white" />
      default:
        return <FileText className="h-4 w-4 text-white" />
    }
  }

  const getBadgeForType = (type: string) => {
    switch (type) {
      case "article":
        return (
          <Badge variant="outline" className="bg-zinc-800 text-white border-zinc-600">
            Article
          </Badge>
        )
      case "documentation":
        return (
          <Badge variant="outline" className="bg-zinc-800 text-white border-zinc-600">
            Docs
          </Badge>
        )
      case "github":
        return (
          <Badge variant="outline" className="bg-zinc-800 text-white border-zinc-600">
            GitHub
          </Badge>
        )
      case "tutorial":
        return (
          <Badge variant="outline" className="bg-zinc-800 text-white border-zinc-600">
            Tutorial
          </Badge>
        )
      default:
        return <Badge variant="outline" className="bg-zinc-800 text-white border-zinc-600">Resource</Badge>
    }
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-2">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-white">
          <FileText className="h-3 w-3 mr-1" />
          Documentation & Resources
          <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 p-4 bg-zinc-800/50 rounded-md text-sm">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Escape Tutorial Hell:</h4>
          <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
            <ExternalLink className="h-3 w-3" />
            <span>Open all in new tabs</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
            <span className="ml-2 text-sm text-gray-400">Loading resources...</span>
          </div>
        ) : resources.length > 0 ? (
          <div className="space-y-3">
            {resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start p-2 rounded-md hover:bg-zinc-700/50 transition-colors"
              >
                <div className="mr-3 mt-0.5">{getIconForType(resource.type)}</div>
                <div className="flex-1">
                  <div className="font-medium mb-1 text-white">{resource.title}</div>
                  <div className="text-xs text-gray-400">{resource.source}</div>
                </div>
                <div>{getBadgeForType(resource.type)}</div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-400">
            <p>No additional resources found for this video.</p>
          </div>
        )}

        <div className="mt-4">
          <Input
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="mb-2 bg-zinc-800 border-zinc-600 text-white"
          />
          <Input
            placeholder="URL"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="mb-2 bg-zinc-800 border-zinc-600 text-white"
          />
          <Button onClick={handleAddResource} className="bg-white text-black hover:bg-gray-200 font-semibold">
            Add Resource
          </Button>
        </div>

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-zinc-700">
          <p className="text-xs text-gray-400">
            <em>Resources curated to help you apply what you learn</em>
          </p>
          <Button size="sm" variant="outline" className="h-7 text-xs border-zinc-600 text-white hover:bg-zinc-800">
            Suggest Resource
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
