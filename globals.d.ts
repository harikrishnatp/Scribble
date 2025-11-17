// globals.d.ts
declare global {
    interface Window {
      onYouTubeIframeAPIReady: () => void;
      YT:any;
    }
  }
  
  export {}; // This is required to make this file a module
  