"use client"

import { Clock, CheckCircle2, Pill, Volume2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import type { IReminder } from "@/entities/Reminder"

interface ReminderCardProps {
  reminder: IReminder
  onTaken: (reminder: IReminder) => void
}

export default function ReminderCard({ reminder, onTaken }: ReminderCardProps) {
  const speakReminder = () => {
    const text = `समय हो गया है ${reminder.medication_name} लेने का। ${reminder.dosage} लें। It's time to take ${reminder.medication_name}, ${reminder.dosage}.`

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "hi-IN"
      speechSynthesis.speak(utterance)
    }
  }

  const getFrequencyColor = (frequency: string) => {
    const colorMap: Record<string, string> = {
      daily: "bg-blue-100 text-blue-800",
      twice_daily: "bg-green-100 text-green-800",
      thrice_daily: "bg-orange-100 text-orange-800",
      weekly: "bg-purple-100 text-purple-800",
      as_needed: "bg-gray-100 text-gray-800",
    }
    return colorMap[frequency] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="h-10 w-10 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <Pill className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{reminder.medication_name}</h4>
              <p className="text-sm text-gray-600 mt-1">{reminder.title}</p>
              <p className="text-sm text-emerald-700 font-medium mt-1">{reminder.dosage}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 h-3 text-emerald-600" />
                  <span className="text-xs text-emerald-700 font-medium">{reminder.time}</span>
                </div>
                <Badge className={getFrequencyColor(reminder.frequency)}>{reminder.frequency.replace("_", " ")}</Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 ml-2">
            <Button
              size="sm"
              variant="outline"
              onClick={speakReminder}
              className="text-purple-600 border-purple-300 hover:bg-purple-50 bg-transparent"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => onTaken(reminder)}
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
