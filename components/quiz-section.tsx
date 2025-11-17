"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Award } from "lucide-react"

export function QuizSection() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-2">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-yellow-400">
          <Award className="h-3 w-3 mr-1" />
          Quiz Challenge
          <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 p-4 bg-gray-800/50 rounded-md text-sm">
        <div className="text-center py-4 text-gray-400">
          <p>Coming Soon</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
