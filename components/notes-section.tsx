"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { PencilLine, ChevronDown, Save, Trash2 } from "lucide-react"

interface NotesSectionProps {
  videoId: string
  videoTitle: string
}

export function NotesSection({ videoId, videoTitle }: NotesSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notes, setNotes] = useState("")
  const [isSaved, setIsSaved] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Load saved notes when component mounts
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes-${videoId}`)
    if (savedNotes) {
      setNotes(savedNotes)
      setIsSaved(true)
    } else {
      setNotes("")
      setIsSaved(false)
    }
  }, [videoId])

  const handleSaveNotes = () => {
    localStorage.setItem(`notes-${videoId}`, notes)
    setIsSaved(true)
    setIsEditing(false)
  }

  const handleDeleteNotes = () => {
    localStorage.removeItem(`notes-${videoId}`)
    setNotes("")
    setIsSaved(false)
    setIsEditing(false)
  }

  const handleEditNotes = () => {
    setIsEditing(true)
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-2">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-green-400">
          <PencilLine className="h-3 w-3 mr-1" />
          My Notes
          <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 p-4 bg-gray-800/50 rounded-md text-sm">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Notes for: {videoTitle}</h4>
          <div className="flex gap-2">
            {isSaved && !isEditing && (
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={handleEditNotes}>
                <PencilLine className="h-3 w-3" />
                <span>Edit</span>
              </Button>
            )}
            {(isEditing || !isSaved) && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1 border-green-500/30 text-green-400 hover:bg-green-500/10"
                onClick={handleSaveNotes}
                disabled={!notes.trim()}
              >
                <Save className="h-3 w-3" />
                <span>Save</span>
              </Button>
            )}
            {isSaved && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1 border-zinc-700 text-white hover:bg-zinc-800"
                onClick={handleDeleteNotes}
              >
                <Trash2 className="h-3 w-3" />
                <span>Delete</span>
              </Button>
            )}
          </div>
        </div>

        {isEditing || !isSaved ? (
          <Textarea
            placeholder="Take notes about this video to help reinforce your learning..."
            className="min-h-[150px] bg-gray-900/50 border-gray-700"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        ) : (
          <div className="min-h-[150px] bg-gray-900/50 border border-gray-700 rounded-md p-3 whitespace-pre-wrap">
            {notes || <span className="text-gray-500 italic">No notes yet. Click Edit to add your notes.</span>}
          </div>
        )}

        <div className="mt-4 text-xs text-gray-400">
          <p>
            <em>Taking notes helps reinforce your learning and makes it easier to review concepts later.</em>
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
