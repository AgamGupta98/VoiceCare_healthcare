"use client"

import { Lightbulb } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function HealthTips() {
  const tips = [
    {
      title: "Stay Hydrated",
      description: "Drink at least 8 glasses of water daily to maintain proper hydration.",
      icon: "💧",
    },
    {
      title: "Regular Exercise",
      description: "30 minutes of moderate exercise daily can improve your overall health.",
      icon: "🏃",
    },
    {
      title: "Balanced Diet",
      description: "Include fruits, vegetables, and proteins in your daily meals.",
      icon: "🥗",
    },
  ]

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-5 w-5 text-yellow-600" />
        <h2 className="text-lg font-semibold text-gray-900">Health Tips</h2>
      </div>
      <div className="space-y-3">
        {tips.map((tip, index) => (
          <Card key={index} className="border-2 border-yellow-100 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">{tip.icon}</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{tip.title}</h4>
                  <p className="text-sm text-gray-700">{tip.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
