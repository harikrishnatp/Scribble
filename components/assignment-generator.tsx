"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2, FileText } from "lucide-react"
import { jsPDF } from "jspdf"

interface AssignmentGeneratorProps {
  videoTitle: string
  videoDescription?: string
  duration?: number
  examType?: string
  onAssignmentGenerated?: (assignment: string) => void
}

export function AssignmentGenerator({
  videoTitle,
  videoDescription,
  duration,
  examType,
  onAssignmentGenerated,
}: AssignmentGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [assignment, setAssignment] = useState("")
  const [selectedExamType, setSelectedExamType] = useState(examType || "")

  const generateAssignment = async () => {
    setIsLoading(true)
    setError("")
    setAssignment("")

    try {
      const response = await fetch("/api/generate-assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoTitle,
          videoDescription,
          duration,
          examType: selectedExamType || undefined,
        }),
      })

      const data = await response.json()

      if (!data.ok) {
        setError(data.error || "Failed to generate assignment")
        return
      }

      setAssignment(data.assignment)
      onAssignmentGenerated?.(data.assignment)
    } catch (err: any) {
      setError(err.message || "Failed to generate assignment")
      console.error("Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const downloadAsPDF = () => {
    if (!assignment) return

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 15
      const textWidth = pageWidth - 2 * margin

      // Split markdown into lines and handle formatting
      const lines = assignment.split("\n")
      let yPosition = margin
      let fontSize = 11
      let isBold = false

      lines.forEach((line: string) => {
        if (yPosition > pageHeight - margin) {
          doc.addPage()
          yPosition = margin
        }

        // Handle headers
        if (line.startsWith("# ")) {
          doc.setFontSize(16)
          doc.setFont("helvetica", "bold")
          yPosition += 2
        } else if (line.startsWith("## ")) {
          doc.setFontSize(13)
          doc.setFont("helvetica", "bold")
          yPosition += 2
        } else if (line.startsWith("### ")) {
          doc.setFontSize(12)
          doc.setFont("helvetica", "bold")
        } else if (line.startsWith("- ") || line.startsWith("* ")) {
          doc.setFontSize(11)
          doc.setFont("helvetica", "normal")
          // Indent bullet points
          const cleanLine = line.replace(/^[-*]\s/, "")
          const bulletLines = doc.splitTextToSize("• " + cleanLine, textWidth - 5)
          bulletLines.forEach((bulletLine: string) => {
            if (yPosition > pageHeight - margin) {
              doc.addPage()
              yPosition = margin
            }
            doc.text(bulletLine, margin + 5, yPosition)
            yPosition += 5
          })
          return
        } else if (line.trim() === "") {
          yPosition += 3
          return
        } else {
          doc.setFontSize(11)
          doc.setFont("helvetica", "normal")
        }

        const cleanLine = line.replace(/^#+\s/, "")
        if (cleanLine.trim()) {
          const textLines = doc.splitTextToSize(cleanLine, textWidth)
          textLines.forEach((textLine: string) => {
            if (yPosition > pageHeight - margin) {
              doc.addPage()
              yPosition = margin
            }
            doc.text(textLine, margin, yPosition)
            yPosition += 6
          })
        } else {
          yPosition += 3
        }
      })

      doc.save(`${videoTitle.replace(/[^a-z0-9]/gi, "_")}_assignment.pdf`)
    } catch (err) {
      console.error("PDF generation error:", err)
      setError("Failed to generate PDF")
    }
  }

  if (!assignment) {
    return (
      <div className="space-y-3">
        {error && (
          <div className="mb-2 p-2 bg-red-900/20 border border-red-700 rounded text-xs text-red-400">
            {error}
          </div>
        )}
        <div>
          <label className="text-xs font-semibold text-white mb-2 block">
            Exam Type (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g., JEE, NEET, GATE, SAT, AIME"
            value={selectedExamType}
            onChange={(e) => setSelectedExamType(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <Button
          onClick={generateAssignment}
          disabled={isLoading}
          variant="outline"
          className="w-full gap-2 border-zinc-600 text-white hover:bg-zinc-800"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating Assignment...</span>
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              <span>Generate Assignment</span>
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={generateAssignment}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="gap-2 border-zinc-600 text-white hover:bg-zinc-800"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Regenerate
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              Regenerate
            </>
          )}
        </Button>
        <Button
          onClick={downloadAsPDF}
          variant="outline"
          size="sm"
          className="gap-2 border-zinc-600 text-white hover:bg-zinc-800"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>
      <div className="space-y-4 bg-zinc-900 border border-zinc-700 rounded-lg p-6 overflow-auto max-h-96">
        <div className="space-y-3 text-gray-300 whitespace-pre-wrap text-sm leading-relaxed font-sans">
          {assignment.split('\n').map((line: string, idx: number) => {
            // Check if line is a section header (all caps or followed by blank line)
            if (line.trim().length > 0 && line === line.toUpperCase() && line.length > 3) {
              return (
                <div key={idx} className="text-xl font-bold text-white mt-4 mb-2">
                  {line}
                </div>
              )
            }
            
            // Check if line is a bold item (**text** or bold pattern)
            if (line.includes('**')) {
              const parts = line.split(/\*\*(.*?)\*\*/g)
              return (
                <div key={idx} className="mb-1">
                  {parts.map((part: string, i: number) => 
                    i % 2 === 1 ? (
                      <strong key={i} className="font-bold text-white">{part}</strong>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </div>
              )
            }
            
            // Check if line is a bullet point
            if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
              return (
                <div key={idx} className="ml-4 mb-1 flex gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>{line.trim().replace(/^[-•]\s*/, '')}</span>
                </div>
              )
            }
            
            // Check if line starts with number (Q1:, Question 1:, etc.)
            if (/^\s*(Q|\d+:|Question|Question \d+)/.test(line.trim())) {
              return (
                <div key={idx} className="font-semibold text-white mt-2 mb-1">
                  {line}
                </div>
              )
            }
            
            // Regular text
            if (line.trim().length > 0) {
              return (
                <div key={idx} className="mb-1">
                  {line}
                </div>
              )
            }
            
            // Empty line for spacing
            return <div key={idx} className="mb-2" />
          })}
        </div>
      </div>
    </div>
  )
}
