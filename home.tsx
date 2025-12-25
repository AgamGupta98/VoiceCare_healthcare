"use client"

import { useEffect, useState } from "react"
import { Mic, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User as UserEntity } from "@/entities/User"

interface HomeProps {
  onLogin: (name: string) => void
}

export default function Home({ onLogin }: HomeProps) {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "hi-IN"
      speechSynthesis.speak(utterance)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await UserEntity.me()
        // If successful, user is logged in, trigger login callback
        onLogin(user.name || user.email)
      } catch (error) {
        // User not logged in, stay on this page
        setIsCheckingAuth(false)
        // Speak instructions after a short delay
        setTimeout(() => {
          speak("नमस्ते, MedEcho में आपका स्वागत है। कृपया लॉग इन करने के लिए बटन दबाएं।")
        }, 1000)
      }
    }
    checkAuth()
  }, [onLogin])

  const handleLogin = async () => {
    try {
      // Simulate login by creating a demo user
      const mockEmail = "demo@medecho.com"
      const mockName = "Demo User"

      // Create or get user
      const existingUsers = await UserEntity.filter({ email: mockEmail })
      let user

      if (existingUsers.length > 0) {
        user = existingUsers[0]
      } else {
        user = await UserEntity.create({
          email: mockEmail,
          name: mockName,
          preferred_language: "english",
        })
      }

      // Store in session
      localStorage.setItem("medecho_current_user", JSON.stringify(user))

      // Call login callback
      onLogin(user.name || user.email)

      speak("स्वागत है। लॉग इन सफल रहा।")
    } catch (error) {
      console.error("[v0] Login failed", error)
      speak("लॉग इन करने में कोई समस्या हुई। कृपया दोबारा प्रयास करें।")
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-100 to-green-200">
        <div className="text-center">
          <p className="text-lg font-semibold text-emerald-800">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-emerald-700 mb-2">MedEcho</h1>
        <p className="text-xl text-gray-600">आपका स्वास्थ्य साथी</p>
        <p className="text-lg text-gray-500">Your Health Companion</p>
      </div>

      <Card className="w-full max-w-sm shadow-2xl bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">लॉग इन करें</h2>
          <p className="text-gray-600 mb-6">
            जारी रखने के लिए कृपया लॉग इन करें।
            <br />
            Please log in to continue.
          </p>

          <Button
            onClick={handleLogin}
            size="lg"
            className="w-full h-24 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-2xl font-bold rounded-full shadow-lg hover:shadow-xl transition-shadow flex flex-col"
          >
            <Mic className="w-10 h-10 mb-1" />
            <span>Login</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => speak("नमस्ते, MedEcho में आपका स्वागत है। कृपया लॉग इन करने के लिए ऊपर दिए गए बड़े हरे बटन को दबाएं।")}
            className="mt-6 text-gray-500"
          >
            <Volume2 className="w-5 h-5 mr-2" />
            निर्देश सुनें
          </Button>
        </CardContent>
      </Card>

      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>एक सुरक्षित और स्वस्थ जीवन की ओर आपका पहला कदम।</p>
        <p>Your first step towards a safe and healthy life.</p>
      </div>
    </div>
  )
}
