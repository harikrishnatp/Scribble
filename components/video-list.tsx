"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { YoutubeIcon, ChevronDown, BookOpen, Award, FileText } from "lucide-react";
import { Modal } from "./ui/modal";
import Image from "next/image";
import { VideoModal } from "./playvideos";

interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed?: boolean;
  thumbnailUrl?: string;
  progress?: number;
}

interface PlaylistProps {
  playlist: {
    videos: Video[];
    id?: string;
  };
  onProgressUpdate: (completedVideos: number) => void;
  onOpenModal: (url: string) => void;
  onVideoProgressUpdate?: (videoId: string, completed: boolean) => void;
}

export function VideoList({ playlist, onProgressUpdate, onOpenModal, onVideoProgressUpdate }: PlaylistProps) {
  const [videos, setVideos] = useState(playlist.videos);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [documentationLinks, setDocumentationLinks] = useState<Record<string, { title: string; url: string }[]>>({});
  const [openSections, setOpenSections] = useState<Record<string, { quiz: boolean; documentation: boolean }>>({});
 

  const [isIframeLoaded,setIsIframeLoaded]=useState(false);
 
  const [openNotes, setOpenNotes] = useState<Record<string, boolean>>({}); // New state for Notes


  
  const toggleVideoCompletion = (videoId: string) => {
    const updatedVideos = videos.map((video) =>
      video.id === videoId ? { ...video, completed: !video.completed } : video
    );
    setVideos(updatedVideos);

    // Pass the updated videos array to the parent component
    const completedCount = updatedVideos.filter((video) => video.completed).length;
    onProgressUpdate(completedCount);

    // Notify parent to save progress to localStorage
    const video = updatedVideos.find((v) => v.id === videoId);
    if (onVideoProgressUpdate && video) {
      onVideoProgressUpdate(videoId, video.completed);
    }
  };

  const handleToggleSection = (videoId: string, section: "quiz" | "documentation") => {
    setOpenSections((prev) => ({
      ...prev,
      [videoId]: {
        ...prev[videoId],
        [section]: !prev[videoId]?.[section],
      },
    }));
  };

  const handleToggleNotes = (videoId: string) => {
    setOpenNotes((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }));
  };

  const handleAddDocumentationLink = (videoId: string, title: string, url: string) => {
    setDocumentationLinks((prev) => ({
      ...prev,
      [videoId]: [...(prev[videoId] || []), { title, url }],
    }));
  };

  const handleSaveNotes = (videoId: string, note: string) => {
    setNotes((prev) => ({
      ...prev,
      [videoId]: note,
    }));
  };

  return (
    
    <div className="rounded-lg border border-gray-800 bg-gray-900 overflow-hidden relative z-10">
      
      <div className="p-4 border-b border-gray-800 bg-gray-800/50">
        <h2 className="text-lg font-semibold">Course Content</h2>
        <p className="text-sm text-gray-400">Complete all videos and assignments to finish the course</p>
      </div>

      <div className="divide-y divide-gray-800">
        {videos.map((video, index) => (
          <div key={video.id} className={`p-4 ${video.completed ? "bg-gray-800/30" : ""}`}>
            <div className="flex items-start gap-4">

              {/* Thumbnail */}
              <div className="flex-shrink-0 relative cursor-pointer"
              onClick={()=>onOpenModal(video.id,`https://www.youtube.com/embed/${video.id}`)}>
                {video.thumbnailUrl ? (
                  <Image
                    src={video.thumbnailUrl || "/placeholder.svg"}
                    alt={video.title}
                    width={120}
                    height={68}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <div className="w-[120px] h-[68px] bg-gray-800 rounded-md flex items-center justify-center">
                    <YoutubeIcon className="h-8 w-8 text-red-500" />
                  </div>
                )}
                <div className="absolute bottom-1 right-1 bg-black/80 text-xs px-1 rounded">{video.duration}</div>
              </div>
              {/* Description */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium line-clamp-2 cursor-pointer text-blue-400 hover:underline"
                    onClick={()=>onOpenModal(`https://www.youtube.com/embed/${video.id}`)}>
                      {index + 1}. {video.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Checkbox
                        checked={video.completed}
                        onCheckedChange={() => toggleVideoCompletion(video.id)}
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                      />
                      <span className="text-xs text-gray-400">
                        {video.completed ? "Completed" : "Mark as completed"}
                      </span>
                    </div>
                  </div>
                </div>
     
                <Collapsible open={!!openNotes[video.id]} onOpenChange={() => handleToggleNotes(video.id)}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-green-400 mt-2">
                      Notes
                      <ChevronDown
                        className={`h-3 w-3 ml-1 transition-transform ${
                          openNotes[video.id] ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 p-4 bg-gray-800/50 rounded-md text-sm">
                    <textarea
                      className="w-full bg-gray-900 text-white border border-gray-700 rounded-md p-2"
                      placeholder="Write your notes here..."
                      value={notes[video.id] || ""}
                      onChange={(e) => handleSaveNotes(video.id, e.target.value)}
                    />
                    {notes[video.id] && (
                      <div className="mt-4 p-2 bg-gray-700 rounded-md text-white">
                        <strong>Your Notes:</strong>
                        <p>{notes[video.id]}</p>
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>

                {/* Assignment Section */}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-blue-400 mt-2">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Assignment
                      <ChevronDown className="h-3 w-3 ml-1 transition-transform" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 p-4 bg-gray-800/50 rounded-md text-sm">
                    <div className="text-center text-gray-400">Coming Soon</div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Quiz Section */}
                <Collapsible open={!!openSections[video.id]?.quiz} onOpenChange={() => handleToggleSection(video.id, "quiz")}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-yellow-400 mt-2">
                      <Award className="h-3 w-3 mr-1" />
                      Quiz
                      <ChevronDown
                        className={`h-3 w-3 ml-1 transition-transform ${
                          openSections[video.id]?.quiz ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 p-4 bg-gray-800/50 rounded-md text-sm">
                    <div className="text-center text-gray-400">Coming Soon</div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Documentation Section */}
                <Collapsible
                  open={!!openSections[video.id]?.documentation}
                  onOpenChange={() => handleToggleSection(video.id, "documentation")}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-purple-400 mt-2">
                      <FileText className="h-3 w-3 mr-1" />
                      Documentation
                      <ChevronDown
                        className={`h-3 w-3 ml-1 transition-transform ${
                          openSections[video.id]?.documentation ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 p-4 bg-gray-800/50 rounded-md text-sm">
                    <div className="space-y-2">
                      {(documentationLinks[video.id] || []).map((link, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                          >
                            {link.title}
                          </a>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <input
                        type="text"
                        placeholder="Title"
                        className="w-full bg-gray-900 text-white border border-gray-700 rounded-md p-2 mb-2"
                        id={`doc-title-${video.id}`}
                      />
                      <input
                        type="text"
                        placeholder="URL"
                        className="w-full bg-gray-900 text-white border border-gray-700 rounded-md p-2 mb-2"
                        id={`doc-url-${video.id}`}
                      />
                      <Button
                        onClick={() =>
                          handleAddDocumentationLink(
                            video.id,
                            (document.getElementById(`doc-title-${video.id}`) as HTMLInputElement).value,
                            (document.getElementById(`doc-url-${video.id}`) as HTMLInputElement).value
                          )
                        }
                        className="bg-green-600 text-white"
                      >
                        Add Link
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
   
  );
}

