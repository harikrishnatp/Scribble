"use client";

import { useEffect } from "react";

interface KeyboardShortcutsOptions {
  onNextVideo?: () => void;
  onPrevVideo?: () => void;
  onTogglePlayPause?: () => void;
  onToggleNotes?: () => void;
}

export function useKeyboardShortcuts({
  onNextVideo,
  onPrevVideo,
  onTogglePlayPause,
  onToggleNotes,
}: KeyboardShortcutsOptions) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      const target = event.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true";

      if (isTyping) return;

      switch (event.code) {
        case "ArrowRight":
          event.preventDefault();
          onNextVideo?.();
          break;
        case "ArrowLeft":
          event.preventDefault();
          onPrevVideo?.();
          break;
        case "Space":
          event.preventDefault();
          onTogglePlayPause?.();
          break;
        case "KeyN":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            onToggleNotes?.();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onNextVideo, onPrevVideo, onTogglePlayPause, onToggleNotes]);
}
