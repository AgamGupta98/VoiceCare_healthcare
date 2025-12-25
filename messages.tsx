"use client"

import { useState } from "react"
import { Bot, User, Phone, Video, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Messages() {
  const [activeTab, setActiveTab] = useState("ai")
  const [selectedChat, setSelectedChat] = useState(null)

  const aiConversations = [
    {
      id: 1,
      title: "Headache & Fever",
      lastMessage: "Take rest and drink fluids. Monitor temperature.",
      timestamp: "2 min ago",
      severity: "medium",
      isUnread: false,
    },
    {
      id: 2,
      title: "Chest Pain Analysis",
      lastMessage: "Please seek immediate medical attention.",
      timestamp: "1 hour ago",
      severity: "high",
      isUnread: true,
    },
    {
      id: 3,
      title: "Stomach Issue",
      lastMessage: "Avoid spicy foods for the next few days.",
      timestamp: "Yesterday",
      severity: "low",
      isUnread: false,
    },
  ]

  const humanConsultations = [
    {
      id: 1,
      doctorName: "Dr. Priya Sharma",
      specialization: "General Medicine",
      lastMessage: "Your blood reports look normal. Continue the prescribed medication.",
      timestamp: "3 hours ago",
      status: "active",
      avatar: "https://placehold.co/100x100?text=Professional+female+doctor+portrait+with+white+coat",
      isUnread: false,
    },
    {
      id: 2,
      doctorName: "Dr. Rajesh Kumar",
      specialization: "Cardiologist",
      lastMessage: "Schedule a follow-up visit next week.",
      timestamp: "Yesterday",
      status: "completed",
      avatar: "https://placehold.co/100x100?text=Professional+male+cardiologist+portrait",
      isUnread: true,
    },
    {
      id: 3,
      doctorName: "Dr. Anita Desai",
      specialization: "Pediatrician",
      lastMessage: "The vaccination schedule has been updated.",
      timestamp: "2 days ago",
      status: "scheduled",
      avatar: "https://placehold.co/100x100?text=Professional+pediatrician+portrait",
      isUnread: false,
    },
  ]

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "scheduled":
        return "bg-blue-500"
      case "completed":
        return "bg-gray-400"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Messages</h1>
        <p className="text-emerald-100">संदेश • Chat with AI or Doctors</p>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="human" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Doctors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-3">
            {aiConversations.map((chat) => (
              <Card key={chat.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          {chat.title}
                          <Badge
                            variant="outline"
                            className={`${getSeverityColor(chat.severity)} text-white border-none text-xs px-2 py-0`}
                          >
                            {chat.severity}
                          </Badge>
                        </h3>
                        {chat.isUnread && <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>}
                      </div>

                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{chat.lastMessage}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{chat.timestamp}</span>
                        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                          Continue Chat
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="human" className="space-y-3">
            {humanConsultations.map((consultation) => (
              <Card key={consultation.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarImage src={consultation.avatar || "/placeholder.svg"} alt={consultation.doctorName} />
                      <AvatarFallback>
                        {consultation.doctorName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 className="font-semibold text-gray-900">{consultation.doctorName}</h3>
                          <p className="text-xs text-gray-500">{consultation.specialization}</p>
                        </div>
                        <Badge className={`${getStatusColor(consultation.status)} text-white text-xs`}>
                          {consultation.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{consultation.lastMessage}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{consultation.timestamp}</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8 px-3 bg-transparent">
                            <Phone className="w-3 h-3 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 px-3 bg-transparent">
                            <Video className="w-3 h-3 mr-1" />
                            Video
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Book Consultation Card */}
            <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Need a Consultation?</h3>
                <p className="text-emerald-100 mb-4 text-sm">Book an appointment with a specialist doctor</p>
                <Button variant="secondary" className="bg-white text-emerald-600 hover:bg-emerald-50">
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
