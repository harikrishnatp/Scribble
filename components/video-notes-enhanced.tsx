"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Save, X, Edit2, Clock, BookMarked, Plus, Sparkles, Loader2, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TimestampedNote {
  id: string;
  timestamp: string;
  timestampSeconds: number;
  content: string;
  createdAt: Date;
}

interface VideoNotesEnhancedProps {
  videoId: string;
  videoTitle: string;
  videoDescription?: string;
  notes?: string;
  timestampedNotes?: TimestampedNote[];
  onSaveNotes: (videoId: string, notes: string) => void;
  onSaveTimestampedNotes?: (videoId: string, notes: TimestampedNote[]) => void;
  onSeekToTimestamp?: (seconds: number) => void;
}

export function VideoNotesEnhanced({
  videoId,
  videoTitle,
  videoDescription,
  notes = "",
  timestampedNotes = [],
  onSaveNotes,
  onSaveTimestampedNotes,
  onSeekToTimestamp,
}: VideoNotesEnhancedProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notesText, setNotesText] = useState(notes);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // Timestamped notes state
  const [tsNotes, setTsNotes] = useState<TimestampedNote[]>(timestampedNotes);
  const [newTimestamp, setNewTimestamp] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setNotesText(notes);
    setTsNotes(timestampedNotes);
    setIsEditing(false);
  }, [videoId, notes, timestampedNotes]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    onSaveNotes(videoId, notesText);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNotesText(notes);
    setIsEditing(false);
  };

  const parseTimestamp = (timestamp: string): number => {
    const parts = timestamp.split(":").map(Number);
    if (parts.length === 2) {
      // mm:ss
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      // hh:mm:ss
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  };

  const formatTimestamp = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAddTimestampedNote = () => {
    if (!newTimestamp || !newNoteContent.trim()) {
      return;
    }

    const timestampSeconds = parseTimestamp(newTimestamp);
    const newNote: TimestampedNote = {
      id: Date.now().toString(),
      timestamp: newTimestamp,
      timestampSeconds,
      content: newNoteContent.trim(),
      createdAt: new Date(),
    };

    const updatedNotes = [...tsNotes, newNote].sort((a, b) => a.timestampSeconds - b.timestampSeconds);
    setTsNotes(updatedNotes);
    
    if (onSaveTimestampedNotes) {
      onSaveTimestampedNotes(videoId, updatedNotes);
    }

    setNewTimestamp("");
    setNewNoteContent("");
    setIsAddingNote(false);
  };

  const handleDeleteTimestampedNote = (id: string) => {
    const updatedNotes = tsNotes.filter((note) => note.id !== id);
    setTsNotes(updatedNotes);
    
    if (onSaveTimestampedNotes) {
      onSaveTimestampedNotes(videoId, updatedNotes);
    }
  };

  const handleGenerateNotes = async () => {
    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/generate-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoTitle,
          videoDescription,
        }),
      });

      const data = await response.json();

      if (!data.ok) {
        setError(data.error || "Failed to generate notes");
        return;
      }

      setNotesText(data.notes);
      setIsEditing(true);
      
      // Auto-focus textarea
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    } catch (err: any) {
      setError(err.message || "Failed to generate notes");
      console.error("Error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const wordCount = notesText.trim().split(/\s+/).filter((word) => word.length > 0).length;

  return (
    <Card className="bg-zinc-900 border border-zinc-700 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <BookMarked className="h-4 w-4 text-white flex-shrink-0" />
              <CardTitle className="text-base truncate">Notes</CardTitle>
            </div>
            <p className="text-xs text-gray-400 truncate">{videoTitle}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="bg-zinc-800 border border-zinc-700 mb-4">
            <TabsTrigger value="general" className="data-[state=active]:bg-white data-[state=active]:text-black">
              General Notes
            </TabsTrigger>
            <TabsTrigger value="timestamped" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <Clock className="h-3 w-3 mr-1" />
              Timestamped ({tsNotes.length})
            </TabsTrigger>
          </TabsList>

          {/* General Notes Tab */}
          <TabsContent value="general" className="space-y-4">
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-700 rounded text-sm text-red-400">
                {error}
              </div>
            )}

            {isEditing ? (
              <>
                <Textarea
                  ref={textareaRef}
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Write your notes here..."
                  className="min-h-[240px] bg-zinc-800 border-zinc-600 text-white placeholder-gray-500 resize-none focus:border-white focus:ring-white"
                />

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{wordCount} words</span>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCancel}
                      size="sm"
                      variant="outline"
                      className="border-zinc-600 text-white hover:bg-zinc-800"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      size="sm"
                      disabled={isSaving}
                      className="bg-white text-black hover:bg-gray-200 font-semibold"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {notesText ? (
                  <div className="min-h-[120px] max-h-[300px] overflow-y-auto bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                    <p className="text-sm text-gray-200 whitespace-pre-wrap break-words">{notesText}</p>
                  </div>
                ) : (
                  <div className="min-h-[120px] flex items-center justify-center bg-zinc-800 rounded-lg border border-zinc-700 border-dashed">
                    <div className="text-center">
                      <BookMarked className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 mb-3">No notes yet.</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsEditing(true)}
                    size="sm"
                    variant="outline"
                    className="border-zinc-600 text-white hover:bg-zinc-800"
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    {notesText ? "Edit" : "Add Notes"}
                  </Button>
                  <Button
                    onClick={handleGenerateNotes}
                    size="sm"
                    variant="outline"
                    disabled={isGenerating}
                    className="border-zinc-600 text-white hover:bg-zinc-800"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-1" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>

                {notesText && (
                  <div className="pt-2 border-t border-zinc-700">
                    <Badge variant="outline" className="border-zinc-600 text-white bg-zinc-800">
                      {wordCount} words
                    </Badge>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Timestamped Notes Tab */}
          <TabsContent value="timestamped" className="space-y-4">
            {/* Add new timestamped note */}
            {!isAddingNote ? (
              <Button
                onClick={() => setIsAddingNote(true)}
                size="sm"
                variant="outline"
                className="w-full border-zinc-600 text-white hover:bg-zinc-800 border-dashed"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Timestamped Note
              </Button>
            ) : (
              <div className="space-y-3 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                <div className="flex gap-2">
                  <Input
                    placeholder="mm:ss or hh:mm:ss"
                    value={newTimestamp}
                    onChange={(e) => setNewTimestamp(e.target.value)}
                    className="w-32 bg-zinc-900 border-zinc-600 text-white placeholder-gray-500"
                  />
                  <Input
                    placeholder="Add note at this timestamp..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    className="flex-1 bg-zinc-900 border-zinc-600 text-white placeholder-gray-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddTimestampedNote();
                      }
                    }}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    onClick={() => {
                      setIsAddingNote(false);
                      setNewTimestamp("");
                      setNewNoteContent("");
                    }}
                    size="sm"
                    variant="outline"
                    className="border-zinc-600 text-white hover:bg-zinc-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddTimestampedNote}
                    size="sm"
                    disabled={!newTimestamp || !newNoteContent.trim()}
                    className="bg-white text-black hover:bg-gray-200"
                  >
                    Add Note
                  </Button>
                </div>
              </div>
            )}

            {/* List of timestamped notes */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {tsNotes.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  No timestamped notes yet. Add notes at specific times in the video!
                </div>
              ) : (
                tsNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <Button
                        onClick={() => onSeekToTimestamp?.(note.timestampSeconds)}
                        size="sm"
                        variant="ghost"
                        className="flex-shrink-0 h-auto p-1 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="font-mono text-xs">{note.timestamp}</span>
                      </Button>
                      <p className="flex-1 text-sm text-gray-200">{note.content}</p>
                      <Button
                        onClick={() => handleDeleteTimestampedNote(note.id)}
                        size="sm"
                        variant="ghost"
                        className="flex-shrink-0 h-auto p-1 text-gray-500 hover:text-red-400 hover:bg-red-950/30 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
