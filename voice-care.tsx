"use client"

import { useState } from "react"
import { Mic, Volume2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface VoiceCareProps {
  userName: string
}

export default function VoiceCare({ userName }: VoiceCareProps) {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [conversation, setConversation] = useState<Array<{ role: string; content: string }>>([])

  const startConversation = async () => {
    setIsListening(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" })
        setIsListening(false)
        setIsProcessing(true)

        try {
          // Speech to Text
          const formData = new FormData()
          formData.append("file", audioBlob, "audio.webm")
          formData.append("model_id", "scribe_v1")

          const sttResponse = await fetch("https://elevenlabs-proxy-server-lipn.onrender.com/v1/speech-to-text", {
            method: "POST",
            headers: {
              customerId: "null",
              Authorization: "Bearer xxx",
            },
            body: formData,
          })

          const sttData = await sttResponse.json()
          const userMessage = sttData.text || ""

          setConversation((prev) => [...prev, { role: "user", content: userMessage }])

          // Get AI Response
          const aiResponse = await fetch("https://llm.blackbox.ai/chat/completions", {
            method: "POST",
            headers: {
              userEmail: "guptaagam125@gmail.com",
              "Content-Type": "application/json",
              Authorization: "Bearer xxx",
            },
            body: JSON.stringify({
              model: "custom/blackbox-ai-chat",
              messages: [
                {
                  role: "system",
                  content:
                    "You are MedEcho, a helpful healthcare AI assistant. Provide brief, clear health guidance and empathetic responses. Always recommend consulting a doctor for serious concerns.",
                },
                { role: "user", content: userMessage },
              ],
            }),
          })

          const aiData = await aiResponse.json()
          const aiMessage = aiData.choices[0].message.content

          setConversation((prev) => [...prev, { role: "assistant", content: aiMessage }])

          // Text to Speech
          const ttsResponse = await fetch(
            "https://elevenlabs-proxy-server-lipn.onrender.com/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb",
            {
              method: "POST",
              headers: {
                customerId: "null",
                "Content-Type": "application/json",
                Authorization: "Bearer xxx",
                Accept: "audio/mpeg",
              },
              body: JSON.stringify({
                text: aiMessage,
                model_id: "eleven_multilingual_v2",
              }),
            },
          )

          const audioData = await ttsResponse.arrayBuffer()
          const audioUrl = URL.createObjectURL(new Blob([audioData], { type: "audio/mpeg" }))
          const audio = new Audio(audioUrl)
          audio.play()
        } catch (error) {
          console.error("[v0] Error in conversation:", error)
        }

        stream.getTracks().forEach((track) => track.stop())
        setIsProcessing(false)
      }

      mediaRecorder.start()
      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop()
        }
      }, 10000)
    } catch (error) {
      console.error("[v0] Error starting conversation:", error)
      setIsListening(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">VoiceCare Assistant</h2>
          <p className="text-lg md:text-xl text-gray-600">Talk to your AI healthcare companion</p>
        </div>

        {/* Voice Button */}
        <Card className="p-8 md:p-12 bg-gradient-to-br from-emerald-500 to-teal-600 border-none shadow-xl mb-6">
          <div className="text-center">
            <Button
              onClick={startConversation}
              disabled={isListening || isProcessing}
              className="h-32 w-32 md:h-40 md:w-40 rounded-full bg-white text-emerald-600 hover:bg-emerald-50 shadow-2xl mx-auto"
            >
              {isListening ? (
                <div className="relative">
                  <Volume2 className="h-16 w-16 md:h-20 md:w-20 animate-pulse" />
                  <div className="absolute -inset-8 border-4 border-white rounded-full animate-ping opacity-75" />
                </div>
              ) : isProcessing ? (
                <MessageSquare className="h-16 w-16 md:h-20 md:w-20 animate-pulse" />
              ) : (
                <Mic className="h-16 w-16 md:h-20 md:w-20" />
              )}
            </Button>
            <p className="text-white text-xl md:text-2xl font-semibold mt-6">
              {isListening ? "Listening..." : isProcessing ? "Processing..." : "Tap to speak"}
            </p>
          </div>
        </Card>

        {/* Conversation History */}
        {conversation.length > 0 && (
          <Card className="p-6 bg-white border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Conversation</h3>
            <div className="space-y-4">
              {conversation.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    message.role === "user"
                      ? "bg-emerald-50 border-2 border-emerald-200 ml-8"
                      : "bg-gray-50 border-2 border-gray-200 mr-8"
                  }`}
                >
                  <p className="font-semibold text-gray-900 mb-1">{message.role === "user" ? userName : "MedEcho"}</p>
                  <p className="text-gray-700">{message.content}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
