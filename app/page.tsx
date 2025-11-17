"use client"

import type React from "react"
import Link from "next/link"
import { Github, Twitter, BookOpen, CheckCircle2, Zap, PenTool } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { useUser } from "@clerk/nextjs"
import YouTubeHero from "@/components/Youtube-hero"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type DotStyle = {
  width: string;
  height: string;
  top: string;
  left: string;
  animationDelay: string;
  animationDuration: string;
};

const features = [
  {
    icon: PenTool,
    title: "Smart Notes",
    description: "Take organized notes directly while watching, with AI-powered suggestions and formatting."
  },
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Access curated resources, articles, and reference materials alongside your videos."
  },
  {
    icon: CheckCircle2,
    title: "Progress Tracking",
    description: "Visual progress indicators and completion stats keep you motivated and on track."
  },
  {
    icon: Zap,
    title: "Quizzes & Tests",
    description: "Test your knowledge with AI-generated quizzes tailored to video content."
  },
]

export default function LandingPage() {
  const [dots, setDots] = useState<DotStyle[]>([]);
  const { user } = useUser();
  const demoRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!demoRef.current) return
    const { left, top, width, height } = demoRef.current.getBoundingClientRect()
    const x = (e.clientX - left) / width - 0.5
    const y = (e.clientY - top) / height - 0.5
    setMousePosition({ x, y })
  }

  useEffect(() => {
    const randomDots: DotStyle[] = Array.from({ length: 30 }).map(() => ({
      width: Math.random() * 3 + 1 + 'px',
      height: Math.random() * 3 + 1 + 'px',
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      animationDelay: Math.random() * 5 + 's',
      animationDuration: Math.random() * 10 + 5 + 's',
    }));
    setDots(randomDots);
  }, []);

  const avatarSrc = "/profile.webp";

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
      linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
    `,
              backgroundSize: "50px 50px",
            }}
          ></div>

          {/* Animated gradient blobs */}
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-zinc-900/30 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-zinc-800/30 blur-3xl" />
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
            <PenTool className="h-5 w-5 text-black" />
          </div>
          <span className="text-xl font-bold text-white">Scribble</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="https://github.com/intojhanurag/Yt-Learn">
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex gap-2 border-zinc-700 bg-black/50 backdrop-blur-sm text-white hover:bg-zinc-900/50"
            >
              <Github className="h-4 w-4" />
              <span>Star on GitHub</span>
            </Button>
          </Link>
          {user ? (
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8 border border-white">
                  <AvatarImage src={avatarSrc} alt="User" />
                  <AvatarFallback>{user.firstName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </Link>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-white text-black hover:bg-gray-200 border-0 shadow-lg shadow-zinc-500/50 font-semibold">
                Login
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <YouTubeHero />

      {/* Features Section */}
      <section id="features" className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything you need to learn better</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Scribble combines the best learning tools to transform passive video watching into active learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group bg-zinc-900/40 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 hover:border-zinc-600 transition-all duration-300"
              >
                <div className="mb-4 p-3 w-fit rounded-lg bg-zinc-800/40 group-hover:bg-zinc-800/60 transition-all">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Demo Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div
          ref={demoRef}
          className="bg-zinc-900/40 backdrop-blur-sm rounded-2xl border border-zinc-700 p-8 max-w-5xl mx-auto shadow-2xl transition-all duration-200 ease-out"
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * -5}deg)`,
          }}
        >
          <h2 className="text-3xl font-bold mb-6">See Scribble in action</h2>
          <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="h-16 w-16 text-white mx-auto mb-4 opacity-50" />
              <p className="text-gray-400">Demo video coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 text-center hover:border-zinc-600 transition-all">
            <div className="text-4xl font-bold text-white mb-2">∞</div>
            <div className="text-gray-300 font-medium">Playlists</div>
            <div className="text-gray-500 text-sm mt-1">Learn any subject</div>
          </div>
          <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 text-center hover:border-zinc-600 transition-all">
            <div className="text-4xl font-bold text-white mb-2">📝</div>
            <div className="text-gray-300 font-medium">Notes</div>
            <div className="text-gray-500 text-sm mt-1">Capture key points</div>
          </div>
          <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 text-center hover:border-zinc-600 transition-all">
            <div className="text-4xl font-bold text-white mb-2">✓</div>
            <div className="text-gray-300 font-medium">Quizzes</div>
            <div className="text-gray-500 text-sm mt-1">Test your knowledge</div>
          </div>
          <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-700 rounded-lg p-6 text-center hover:border-zinc-600 transition-all">
            <div className="text-4xl font-bold text-white mb-2">🏆</div>
            <div className="text-gray-300 font-medium">Achievements</div>
            <div className="text-gray-500 text-sm mt-1">Get recognized</div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Loved by learners everywhere</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join thousands of students who are using Scribble to learn more effectively
          </p>
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            className="border-zinc-700 bg-black/50 backdrop-blur-sm gap-2 text-white hover:bg-zinc-900/50"
          >
            <Twitter className="h-4 w-4 text-blue-400" />
            <a href="https://x.com">
              <span>Follow us on X</span>
            </a>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center bg-zinc-900/60 backdrop-blur-sm border border-zinc-700 rounded-2xl p-12">
          <h2 className="text-4xl font-bold mb-4">Ready to transform your learning?</h2>
          <p className="text-gray-300 mb-8 text-lg">Start for free today. No credit card required.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 shadow-lg shadow-zinc-500/50 font-semibold">
                Get Started Free
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="border-zinc-700 text-white hover:bg-zinc-900/50">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 py-12 border-t border-zinc-900 text-center text-gray-500 text-sm">
        <p>© 2025 Scribble. All rights reserved. Made with 💜</p>
      </footer>
    </div>
  )
}
