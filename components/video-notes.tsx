"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Save, X, Edit2, Clock, BookMarked } from "lucide-react";

interface VideoNotesProps {
  videoId: string;
  videoTitle: string;
  notes?: string;
  onSaveNotes: (videoId: string, notes: string) => void;
}

export function VideoNotes({ videoId, videoTitle, notes = "", onSaveNotes }: VideoNotesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notesText, setNotesText] = useState(notes);
  const [isSaving, setIsSaving] = useState(false);

  // Update notesText when the videoId or notes prop changes
  const handleVideoChange = () => {
    setNotesText(notes);
    setIsEditing(false);
  };

  // Use effect to update notes when video changes
  useEffect(() => {
    handleVideoChange();
  }, [videoId, notes]);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    onSaveNotes(videoId, notesText);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNotesText(notes);
    setIsEditing(false);
  };

  const wordCount = notesText.trim().split(/\s+/).filter((word) => word.length > 0).length;
  const lastModified = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="bg-zinc-900 border border-zinc-700 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <BookMarked className="h-4 w-4 text-white flex-shrink-0" />
              <CardTitle className="text-base truncate">Notes for this video</CardTitle>
            </div>
            <p className="text-xs text-gray-400 truncate">{videoTitle}</p>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              size="sm"
              variant="outline"
              className="border-zinc-600 text-white hover:bg-zinc-800 flex-shrink-0"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <Textarea
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
                  <p className="text-sm text-gray-500">No notes yet. Click Edit to add notes for this video.</p>
                </div>
              </div>
            )}

            {notesText && (
              <div className="flex items-center justify-between pt-2 border-t border-zinc-700">
                <div className="flex gap-2">
                  <Badge variant="outline" className="border-zinc-600 text-white bg-zinc-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Updated
                  </Badge>
                  <Badge variant="outline" className="border-zinc-600 text-white bg-zinc-800">
                    {wordCount} words
                  </Badge>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
