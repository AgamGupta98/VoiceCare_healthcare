"use client"

import { useState } from "react"
import { Mic, MicOff, Loader2, Heart, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface VoiceLoginProps {
  onLogin: (name: string) => void
}

export default function VoiceLogin({ onLogin }: VoiceLoginProps) {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [name, setName] = useState("")
  const [showTextInput, setShowTextInput] = useState(false)

  const startVoiceLogin = async () => {
    setIsListening(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        setIsListening(false)
        setIsProcessing(true)

        const audioBlob = new Blob(chunks, { type: "audio/webm" })

        // Convert to base64
        const reader = new FileReader()
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(",")[1]

          // Speech to text
          const response = await fetch("https://elevenlabs-proxy-server-lipn.onrender.com/v1/speech-to-text", {
            method: "POST",
            headers: {
              customerId: "null",
              Authorization: "Bearer xxx",
            },
            body: (() => {
              const formData = new FormData()
              formData.append("file", audioBlob, "audio.webm")
              formData.append("model_id", "scribe_v1")
              return formData
            })(),
          })

          const data = await response.json()
          const userName = data.text || "User"

          setName(userName)
          setIsProcessing(false)

          // Auto login after 2 seconds
          setTimeout(() => {
            onLogin(userName)
          }, 2000)
        }
        reader.readAsDataURL(audioBlob)

        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()

      // Auto stop after 5 seconds
      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop()
        }
      }, 5000)
    } catch (error) {
      console.error("[v0] Error accessing microphone:", error)
      setIsListening(false)
      setShowTextInput(true)
    }
  }

  const handleTextLogin = () => {
    if (name.trim()) {
      onLogin(name.trim())
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 bg-white/90 backdrop-blur-sm shadow-2xl border-2 border-teal-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 mb-4">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-teal-900 mb-2">MedEcho</h1>
          <p className="text-xl text-teal-700">AI-Powered Healthcare Companion</p>
        </div>

        {!showTextInput ? (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-800 mb-2">Welcome!</p>
              <p className="text-lg text-gray-600">Speak your name to continue</p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <Button
                size="lg"
                onClick={startVoiceLogin}
                disabled={isListening || isProcessing}
                className="h-32 w-32 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-lg transition-all"
              >
                {isListening ? (
                  <div className="relative">
                    <MicOff className="h-12 w-12 animate-pulse" />
                    <div className="absolute -inset-8 border-4 border-teal-400 rounded-full animate-ping" />
                  </div>
                ) : isProcessing ? (
                  <Loader2 className="h-12 w-12 animate-spin" />
                ) : (
                  <Mic className="h-12 w-12" />
                )}
              </Button>

              <p className="text-lg font-medium text-gray-700">
                {isListening ? "Listening... Speak your name" : isProcessing ? "Processing..." : "Tap to speak"}
              </p>

              {name && (
                <div className="p-4 bg-teal-50 rounded-lg border-2 border-teal-200">
                  <p className="text-lg text-teal-800">
                    Welcome, <span className="font-bold">{name}</span>!
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowTextInput(true)}
                className="w-full border-2 border-teal-300 text-teal-700 hover:bg-teal-50"
              >
                Type your name instead
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-800 mb-2">Welcome!</p>
              <p className="text-lg text-gray-600">Enter your name</p>
            </div>

            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleTextLogin()}
                className="h-14 text-xl border-2 border-teal-300 focus:border-teal-500"
              />

              <Button
                onClick={handleTextLogin}
                disabled={!name.trim()}
                className="w-full h-14 text-xl bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
              >
                Continue
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowTextInput(false)}
                className="w-full border-2 border-teal-300 text-teal-700 hover:bg-teal-50"
              >
                <Mic className="h-5 w-5 mr-2" />
                Use voice instead
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Volume2 className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Voice-First Design</p>
              <p>
                MedEcho is designed for everyone, including those with low literacy. Use voice commands throughout the
                app.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
