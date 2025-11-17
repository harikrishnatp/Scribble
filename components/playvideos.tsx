// components/VideoModal.tsx
import React, { useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  youtubeUrl: string; // full URL like https://www.youtube.com/watch?v=xyz
  onVideoComplete:()=>void
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  youtubeUrl,
  onVideoComplete
}) => {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const loadYouTubeAPI = () => {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.body.appendChild(script);
    
        window.onYouTubeIframeAPIReady = () => {
          const videoId = new URL(youtubeUrl).searchParams.get("v"); // Extract video ID from URL
          const player = new window.YT.Player(iframeRef.current!, {
            videoId,
            events: {
              onStateChange: (event: any) => {
                if (event.data === window.YT.PlayerState.ENDED) {
                  onVideoComplete(); // Mark video as completed when it ends
                }
              },
            },
          });
        };
      };
    
      // Load YouTube API and initialize the player when the modal is opened
      useEffect(() => {
        if (isOpen) {
          loadYouTubeAPI(); // Load the API when modal is open
        }
      }, [isOpen]);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-2">
        
        <div className="aspect-video w-full">
          <iframe
            className="w-full h-full rounded-xl"
            src={`${youtubeUrl}?autoplay=1`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
};
