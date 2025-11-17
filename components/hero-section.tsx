"use client"

import { Button } from "@/components/ui/button"
import { PenTool, BookOpen, Zap } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-black py-20 md:py-32">
      {/* Minimal black background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
      linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
    `,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Floating pen icon */}
      <div className="absolute top-20 right-16 animate-float-horizontal">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white p-3">
          <PenTool className="h-10 w-10 text-black" />
        </div>
      </div>

      {/* Floating book icon */}
      <div className="absolute bottom-32 left-12 animate-float-horizontal">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-800 p-2 border border-zinc-700">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Floating spark icon */}
      <div className="absolute top-40 left-20 animate-float-horizontal-delayed">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-800 p-2 border border-zinc-700">
          <Zap className="h-6 w-6 text-white" />
        </div>
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full mb-8 border border-zinc-700">
            <span className="h-2 w-2 rounded-full bg-white"></span>
            <span className="text-sm text-white">Scribble v2.0</span>
          </div>
          
          <h1 className="mb-6 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
            Learn & <span className="text-white">Scribble Notes</span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-3xl text-lg md:text-xl text-gray-400">
            Turn any YouTube playlist into an interactive learning experience. Take notes, track progress, ace quizzes, and master new skills.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/sign-up">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-semibold">
                Start Learning Free
              </Button>
            </Link>
            <Link href="#features" className="text-gray-400 hover:text-white transition-colors font-medium">
              See how it works →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
