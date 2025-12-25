"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface NotificationBellProps {
  count: number
}

export default function NotificationBell({ count }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(!isOpen)}>
      <Bell className="h-6 w-6" />
      {count > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
          {count}
        </Badge>
      )}
    </Button>
  )
}
