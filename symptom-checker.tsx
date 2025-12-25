"use client"

import { useState } from "react"
import { ArrowLeft, Mic, Heart, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface SymptomCheckerProps {
  onBack: () => void
}

export default function SymptomChecker({ onBack }: SymptomCheckerProps) {
  const [isListening, setIsListening] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [symptoms, setSymptoms] = useState("")
  const [analysis, setAnalysis] = useState<any>(null)

  const startVoiceInput = async () => {
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

        const formData = new FormData()
        formData.append("file", audioBlob, "audio.webm")
        formData.append("model_id", "scribe_v1")

        const response = await fetch("https://elevenlabs-proxy-server-lipn.onrender.com/v1/speech-to-text", {
          method: "POST",
          headers: {
            customerId: "null",
            Authorization: "Bearer xxx",
          },
          body: formData,
        })

        const data = await response.json()
        setSymptoms(data.text || "")

        stream.getTracks().forEach((track) => track.stop())
        setIsListening(false)
      }

      mediaRecorder.start()
      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop()
        }
      }, 10000)
    } catch (error) {
      console.error("[v0] Error with voice input:", error)
      setIsListening(false)
    }
  }

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) return

    setIsAnalyzing(true)

    try {
      const response = await fetch("https://llm.blackbox.ai/chat/completions", {
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
                "You are a medical AI assistant. Analyze symptoms and provide potential conditions, severity level (low/medium/high), and recommendations. Format your response as JSON with fields: possibleConditions (array), severity (string), recommendations (array), disclaimer (string). Always include a disclaimer to consult a real doctor.",
            },
            {
              role: "user",
              content: `Analyze these symptoms: ${symptoms}`,
            },
          ],
        }),
      })

      const data = await response.json()
      const content = data.choices[0].message.content

      // Try to parse JSON response
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsedAnalysis = JSON.parse(jsonMatch[0])
          setAnalysis(parsedAnalysis)
        } else {
          // Fallback if not JSON
          setAnalysis({
            possibleConditions: ["General health concern"],
            severity: "medium",
            recommendations: [content],
            disclaimer:
              "This is AI-generated information. Please consult a healthcare professional for proper diagnosis.",
          })
        }
      } catch {
        setAnalysis({
          possibleConditions: ["Unable to analyze"],
          severity: "medium",
          recommendations: [content],
          disclaimer:
            "This is AI-generated information. Please consult a healthcare professional for proper diagnosis.",
        })
      }
    } catch (error) {
      console.error("[v0] Error analyzing symptoms:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "text-green-700 bg-green-50 border-green-200"
      case "high":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
    }
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white/80 backdrop-blur-sm border-b-2 border-teal-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button onClick={onBack} variant="ghost" className="text-teal-600">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-teal-900 mb-3">AI Symptom Checker</h2>
          <p className="text-xl text-gray-700">Describe your symptoms and get AI-powered health insights</p>
        </div>

        <Card className="p-8 bg-white border-2 border-teal-200 mb-6">
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">Describe your symptoms</label>
              <Textarea
                placeholder="E.g., I have a headache and mild fever for 2 days..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="min-h-32 text-lg border-2 border-gray-300 focus:border-teal-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={startVoiceInput}
                disabled={isListening || isAnalyzing}
                className="flex-1 h-14 text-lg bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
              >
                {isListening ? (
                  <>
                    <Mic className="h-6 w-6 mr-2 animate-pulse" />
                    Listening...
                  </>
                ) : (
                  <>
                    <Mic className="h-6 w-6 mr-2" />
                    Speak Symptoms
                  </>
                )}
              </Button>

              <Button
                onClick={analyzeSymptoms}
                disabled={!symptoms.trim() || isAnalyzing}
                className="flex-1 h-14 text-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Heart className="h-6 w-6 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {analysis && (
          <Card className="p-8 bg-white border-2 border-teal-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Analysis Results</h3>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-6 w-6 text-teal-600" />
                  <h4 className="text-xl font-semibold text-gray-900">Severity Level</h4>
                </div>
                <div
                  className={`inline-block px-4 py-2 rounded-lg border-2 font-semibold ${getSeverityColor(analysis.severity)}`}
                >
                  {analysis.severity.toUpperCase()}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="h-6 w-6 text-teal-600" />
                  <h4 className="text-xl font-semibold text-gray-900">Possible Conditions</h4>
                </div>
                <ul className="space-y-2">
                  {analysis.possibleConditions?.map((condition: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700 text-lg">
                      <CheckCircle className="h-5 w-5 text-teal-600 mt-1 flex-shrink-0" />
                      <span>{condition}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-6 w-6 text-teal-600" />
                  <h4 className="text-xl font-semibold text-gray-900">Recommendations</h4>
                </div>
                <ul className="space-y-2">
                  {analysis.recommendations?.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700 text-lg">
                      <span className="text-teal-600 font-bold flex-shrink-0">{index + 1}.</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-red-800 font-semibold">
                  <AlertCircle className="inline h-5 w-5 mr-2" />
                  {analysis.disclaimer}
                </p>
              </div>

              <Button
                onClick={onBack}
                className="w-full h-14 text-lg bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
              >
                Book Doctor Appointment
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
