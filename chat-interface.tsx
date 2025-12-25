"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Send, Mic, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ChatInterfaceProps {
  chat: {
    id: number
    title?: string
    doctorName?: string
    lastMessage: string
    timestamp: string
  }
  onBack: () => void
  isAI?: boolean
}

export default function ChatInterface({ chat, onBack, isAI }: ChatInterfaceProps) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello, how can I help you today?",
      sender: "them",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      text: chat.lastMessage,
      sender: "them",
      timestamp: chat.timestamp,
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const newMsg = {
      id: Date.now(),
      text: newMessage,
      sender: "me",
      timestamp: "Just now",
    }

    setMessages((prev) => [...prev, newMsg])
    setNewMessage("")

    // Simulate response
    if (isAI) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: "I understand your concern. Let me help you with that...",
            sender: "them",
            timestamp: "Just now",
          },
        ])
      }, 1000)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-emerald-500 p-4 text-white">
        <div className="flex items-center gap-3">
          <Button onClick={onBack} variant="ghost" size="icon" className="text-white hover:bg-emerald-600">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-emerald-700 text-white">
              {isAI ? "AI" : chat.doctorName?.[0] || "D"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{isAI ? "AI Assistant" : chat.doctorName || chat.title}</h3>
            <p className="text-xs text-emerald-100">{isAI ? "Always available" : "Online"}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === "me"
                  ? "bg-emerald-500 text-white"
                  : "bg-white border-2 border-gray-200 text-gray-900"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${message.sender === "me" ? "text-emerald-100" : "text-gray-500"}`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t-2 border-gray-200">
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon">
            <Paperclip className="h-5 w-5 text-gray-500" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="button" variant="ghost" size="icon">
            <Mic className="h-5 w-5 text-emerald-600" />
          </Button>
          <Button type="submit" size="icon" className="bg-emerald-500 hover:bg-emerald-600">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}
