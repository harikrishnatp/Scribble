"use client";

import { Button } from "@/components/ui/button";
import { PenTool, CheckCircle2, BookMarked } from "lucide-react";
import Link from "next/link";

export default function YouTubeHero() {
  return (
    <>
      <section className="relative w-full overflow-hidden bg-black py-20 md:py-32">
        {/* Minimal black background */}
        <div className="absolute inset-0 bg-black"></div>

        {/* Floating pen icon */}
        <div className="absolute top-10 right-10 animate-float-horizontal">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white p-3">
            <PenTool className="h-10 w-10 text-black" />
          </div>
        </div>

        {/* Floating check icon */}
        <div className="absolute bottom-20 left-10 animate-float-horizontal">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-zinc-800 p-3 border border-zinc-700">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Floating book icon */}
        <div className="absolute top-32 left-10 animate-float-horizontal-delayed">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-zinc-800 p-3 border border-zinc-700">
            <BookMarked className="h-8 w-8 text-white" />
          </div>
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full mb-6 border border-zinc-700">
              <span className="h-2 w-2 rounded-full bg-white"></span>
              <span className="text-sm text-white">Scribble - Learn Smarter</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              Master any YouTube playlist <span className="text-white">with Scribble</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400 md:text-xl">
              Transform YouTube videos into structured learning. Take notes, complete quizzes, track progress, and earn achievements.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-semibold">
                  Start Learning Now
                </Button>
              </Link>
              <Link href="#features" className="text-gray-400 hover:text-white transition-colors">
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
