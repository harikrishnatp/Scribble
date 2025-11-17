"use client";

import React, { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Download, Youtube } from "lucide-react";
import html2canvas from "html2canvas";

interface AchievementCardProps {
  userData: {
    email: string;
    completedVideos: number;
    playlistName: string;
    playlistUrl: string;
    avatarUrl: string;
    thumbnailUrl:string
  };
}

export function AchievementCard({ userData }: AchievementCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const downloadButtonRef = useRef<HTMLButtonElement>(null);

  const downloadCard = async () => {
    if (!cardRef.current || !downloadButtonRef.current) return;

    try {
      downloadButtonRef.current.style.display = "none";

      // Ensure fonts are loaded
      await document.fonts.ready;

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      downloadButtonRef.current.style.display = "block";

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${userData.email}-achievement-card.png`;
      link.click();
    } catch (error) {
      console.error("Error generating card:", error);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div
        ref={cardRef}
        className="w-full max-w-sm rounded-lg overflow-hidden border-4 border-red-600 bg-black text-white shadow-lg"
      >
        <CardHeader className="pb-2 pt-6 px-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-red-500">Yt</span>
              <span className="font-bold text-xl">Learn</span>
            </div>
            <h3 className="text-sm text-gray-400">ACHIEVEMENT CARD</h3>
          </div>
          <Youtube className="h-8 w-8 text-red-600" />
        </CardHeader>

        <CardContent className="px-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="rounded-full border-4 border-red-600 overflow-hidden h-24 w-24">
                <Avatar className="h-full w-full">
                  <AvatarImage src={userData.avatarUrl || "/profile.webp"} />
                  <AvatarFallback>{userData.email}</AvatarFallback>
                </Avatar>
              </div>
            </div>

            <h2 className="mt-4 text-xl font-bold break-all">{userData.email}</h2>
            <p className="text-gray-400 text-sm break-all">{userData.email}</p>

            <div className="grid grid-cols-2 gap-4  w-full mt-6 text-center">
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-xs">Completed Videos</p>
                <p className="text-2xl font-bold">{userData.completedVideos}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-xs">Playlist</p>
                <p className="text-sm font-medium break-words">
                  {userData.playlistName.length > 40
                    ? userData.playlistName.slice(0, 40) + "..."
                    : userData.playlistName}
                </p>
              </div>
            </div>

            <div className="mt-6 w-full bg-gray-800 rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-2">Playlist</p>
              {userData.thumbnailUrl && (
                  <img
                    src={userData.thumbnailUrl}
                    alt="Playlist Thumbnail"
                    crossOrigin="anonymous"
                    className="w-full h-20 object-cover rounded-md border border-red-600"
                  />
                )}

            </div>
          </div>

        </CardContent>

        <CardFooter className="bg-gray-800 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Youtube className="h-4 w-4 text-red-600" />
            <span className="text-xs">YouTube Learning</span>
          </div>
          <Button
            ref={downloadButtonRef}
            onClick={downloadCard}
            className="bg-blue-600 text-white"
          >
            <Download className="mr-2 h-4 w-4" /> Don't Click
          </Button>
        </CardFooter>
      </div>
    </div>
  );
}
